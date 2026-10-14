const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById
} = require('../controllers/orderController');
const { protect, optionalAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(optionalAuth, createOrder);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(getOrderById);

module.exports = router;
