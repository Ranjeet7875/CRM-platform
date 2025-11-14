const express = require('express');
const {
  getDashboardAnalytics,
  getSalesTrends
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', protect, getDashboardAnalytics);
router.get('/trends', protect, getSalesTrends);

module.exports = router;
