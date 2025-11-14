const Activity = require('../models/Activity');

// @desc    Get activities for a lead
// @route   GET /api/activities/lead/:leadId
// @access  Private
const getLeadActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ lead: req.params.leadId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create activity
// @route   POST /api/activities
// @access  Private
const createActivity = async (req, res) => {
  try {
    const activity = await Activity.create({
      ...req.body,
      user: req.user._id
    });

    const populatedActivity = await Activity.findById(activity._id)
      .populate('user', 'name email')
      .populate('lead', 'companyName');

    res.status(201).json(populatedActivity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLeadActivities, createActivity };