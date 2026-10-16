const express = require('express');
const { getAdminAnalytics, quickRestockProduct } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/analytics')
  .get(protect, authorize('admin'), getAdminAnalytics);

router.route('/products/:id/stock')
  .put(protect, authorize('admin'), quickRestockProduct);

module.exports = router;
