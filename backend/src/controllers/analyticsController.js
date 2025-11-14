const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.role === 'sales_executive' ? req.user._id : null;
    const matchQuery = userId ? { owner: userId } : {};

    // Total leads
    const totalLeads = await Lead.countDocuments(matchQuery);

    // Leads by status
    const leadsByStatus = await Lead.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Conversion rate
    const converted = await Lead.countDocuments({ ...matchQuery, status: 'converted' });
    const conversionRate = totalLeads > 0 ? (converted / totalLeads * 100).toFixed(2) : 0;

    // Revenue
    const revenueData = await Lead.aggregate([
      { $match: { ...matchQuery, status: 'converted' } },
      { $group: { _id: null, total: { $sum: '$estimatedValue' } } }
    ]);

    // Recent activities
    const recentActivities = await Activity.find(userId ? { user: userId } : {})
      .populate('lead', 'companyName')
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    // Leads by source
    const leadsBySource = await Lead.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);

    res.json({
      totalLeads,
      leadsByStatus,
      conversionRate: parseFloat(conversionRate),
      totalRevenue: revenueData[0]?.total || 0,
      recentActivities,
      leadsBySource
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sales trends
// @route   GET /api/analytics/trends
// @access  Private
const getSalesTrends = async (req, res) => {
  try {
    const { months = 6 } = req.query;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const trends = await Lead.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          leads: { $sum: 1 },
          revenue: { $sum: '$estimatedValue' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardAnalytics, getSalesTrends };