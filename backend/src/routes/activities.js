const express = require('express');
const {
  getLeadActivities,
  createActivity
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/lead/:leadId', protect, getLeadActivities);
router.post('/', protect, createActivity);

module.exports = router;