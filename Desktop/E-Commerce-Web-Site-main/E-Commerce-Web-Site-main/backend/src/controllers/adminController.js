const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get Admin Dashboard Analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAdminAnalytics = async (req, res) => {
  try {
    // 1. Total Orders & Orders by status
    const totalOrders = await Order.countDocuments();
    const processingOrders = await Order.countDocuments({ orderStatus: 'Processing' });
    const shippedOrders = await Order.countDocuments({ orderStatus: 'Shipped' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });

    // 2. Total Revenue (LKR) from non-cancelled orders
    const revenueAggregation = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // 3. Products & Low Stock Intelligence
    const totalProducts = await Product.countDocuments();
    const lowStockThreshold = 5;
    const lowStockProducts = await Product.find({ countInStock: { $lte: lowStockThreshold } })
      .select('title category price countInStock brand images')
      .sort({ countInStock: 1 });

    // Out of stock count
    const outOfStockCount = await Product.countDocuments({ countInStock: { $lte: 0 } });

    // 4. Total Customers
    const totalCustomers = await User.countDocuments({ role: { $ne: 'admin' } });

    // 5. Category Distribution
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          totalStock: { $sum: '$countInStock' }
        }
      }
    ]);

    // 6. Recent Orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalOrders,
          totalProducts,
          totalCustomers,
          lowStockCount: lowStockProducts.length,
          outOfStockCount
        },
        orderStatusBreakdown: {
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders
        },
        categoryStats,
        lowStockProducts,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analytics',
      error: error.message
    });
  }
};

// @desc    Quick Restock Product
// @route   PUT /api/admin/products/:id/stock
// @access  Private/Admin
exports.quickRestockProduct = async (req, res) => {
  try {
    const { countInStock, addStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (addStock !== undefined) {
      product.countInStock += Number(addStock);
    } else if (countInStock !== undefined) {
      product.countInStock = Number(countInStock);
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: `Stock updated for "${product.title}" to ${product.countInStock}`,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update stock',
      error: error.message
    });
  }
};
