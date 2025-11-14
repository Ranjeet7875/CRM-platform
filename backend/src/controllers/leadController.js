const Lead = require('../models/Lead');
const Activity = require('../models/Activity');
const { createNotification } = require('../services/notificationService');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
  try {
    const { status, priority, search, page = 1, limit = 10 } = req.query;
    
    // Build query
    let query = {};
    
    // Role-based filtering
    if (req.user.role === 'sales_executive') {
      query.owner = req.user._id;
    }
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const leads = await Lead.find(query)
      .populate('owner', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Lead.countDocuments(query);

    res.json({
      leads,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('owner', 'name email');

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Check ownership for sales executives
    if (req.user.role === 'sales_executive' && lead.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this lead' });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
  try {
    const leadData = {
      ...req.body,
      owner: req.body.owner || req.user._id
    };

    const lead = await Lead.create(leadData);

    // Create activity log
    await Activity.create({
      lead: lead._id,
      user: req.user._id,
      type: 'note',
      title: 'Lead created',
      description: `New lead created: ${lead.companyName}`
    });

    // Send notification if assigned to someone else
    if (leadData.owner !== req.user._id.toString()) {
      await createNotification({
        recipient: leadData.owner,
        type: 'lead_assigned',
        title: 'New Lead Assigned',
        message: `You have been assigned a new lead: ${lead.companyName}`,
        link: `/leads/${lead._id}`
      });
    }

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res) => {
  try {
    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Check authorization
    if (req.user.role === 'sales_executive' && lead.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this lead' });
    }

    // Track status changes
    if (req.body.status && req.body.status !== lead.status) {
      await Activity.create({
        lead: lead._id,
        user: req.user._id,
        type: 'status_change',
        title: 'Status updated',
        description: `Status changed from ${lead.status} to ${req.body.status}`,
        metadata: {
          oldValue: lead.status,
          newValue: req.body.status
        }
      });
    }

    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin/Manager)
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await lead.deleteOne();
    await Activity.deleteMany({ lead: lead._id });

    res.json({ message: 'Lead removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLeads, getLead, createLead, updateLead, deleteLead };