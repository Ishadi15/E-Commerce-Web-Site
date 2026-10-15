const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendOrderInvoiceEmail, generateInvoiceHTML } = require('../utils/emailService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (Guest) or Private (Logged in)
exports.createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      paymentResult,
      itemsPrice,
      shippingPrice,
      totalPrice,
      customerInfo
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items specified'
      });
    }

    // 1. Stock Intelligence Check: Verify stock availability for all items
    for (const item of orderItems) {
      if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
        const productInDb = await Product.findById(item.product);
        if (productInDb) {
          if (productInDb.countInStock < item.quantity) {
            return res.status(400).json({
              success: false,
              message: `Product "${productInDb.title}" has insufficient stock. Only ${productInDb.countInStock} items available.`
            });
          }
        }
      } else if (item.name) {
        // Fallback for non-ObjectId string IDs (e.g. 'm1'): look up by name in DB
        const productByTitle = await Product.findOne({ title: item.name });
        if (productByTitle) {
          item.product = productByTitle._id; // Map to real DB product ObjectId
          if (productByTitle.countInStock < item.quantity) {
            return res.status(400).json({
              success: false,
              message: `Product "${productByTitle.title}" has insufficient stock. Only ${productByTitle.countInStock} items available.`
            });
          }
        }
      }
    }

    // 2. Prepare Order Data
    const isOnlinePayment = paymentMethod === 'Credit Card' || paymentMethod === 'PayHere' || paymentMethod === 'Online Card Payment';
    const orderData = {
      orderItems,
      shippingAddress,
      paymentMethod: isOnlinePayment ? 'Credit Card' : 'Cash on Delivery',
      paymentResult: paymentResult || {},
      itemsPrice: Number(itemsPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      totalPrice: Number(totalPrice) || 0,
      customerInfo: customerInfo || {},
      orderStatus: 'Processing',
      isPaid: isOnlinePayment,
      paidAt: isOnlinePayment ? Date.now() : null
    };

    // If user is authenticated, attach user ID
    if (req.user && req.user._id) {
      orderData.user = req.user._id;
    }

    // 3. Create Order
    const order = await Order.create(orderData);

    // 4. Decrement countInStock atomically for each ordered product
    for (const item of orderItems) {
      if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { countInStock: -item.quantity }
        });
      }
    }

    // 5. Automated Email Invoicing: Send receipt in background
    sendOrderInvoiceEmail(order).catch(err => {
      console.warn('Background invoice email dispatch note:', err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: error.message
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user orders',
      error: error.message
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order',
      error: error.message
    });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { status, keyword } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    if (keyword && keyword.trim()) {
      const regex = new RegExp(keyword.trim(), 'i');
      query.$or = [
        { 'customerInfo.name': regex },
        { 'customerInfo.email': regex },
        { 'customerInfo.phone': regex }
      ];
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message
    });
  }
};

// @desc    Update order fulfillment status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const previousStatus = order.orderStatus;
    order.orderStatus = status;

    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      // If payment was COD, deliver means paid
      if (!order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
      }
    } else if (status === 'Processing' || status === 'Shipped') {
      order.isDelivered = false;
      order.deliveredAt = null;
    } else if (status === 'Cancelled' && previousStatus !== 'Cancelled') {
      // Restock inventory if order was cancelled
      for (const item of order.orderItems) {
        if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { countInStock: item.quantity }
          });
        }
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// @desc    Get printable / HTML order invoice
// @route   GET /api/orders/:id/invoice
// @access  Public
exports.getOrderInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send('<h2>Order not found</h2>');
    }

    const html = generateInvoiceHTML(order);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    res.status(500).send('<h2>Error generating invoice</h2>');
  }
};
