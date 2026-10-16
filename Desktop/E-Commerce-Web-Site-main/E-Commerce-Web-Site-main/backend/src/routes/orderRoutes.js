const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getOrderInvoice
} = require('../controllers/orderController');
const { protect, authorize, optionalAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(optionalAuth, createOrder)
  .get(protect, authorize('admin'), getAllOrders);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id/invoice')
  .get(getOrderInvoice);

router.route('/:id/status')
  .put(protect, authorize('admin'), updateOrderStatus);

router.route('/:id')
  .get(getOrderById);

module.exports = router;
