const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['call', 'email', 'meeting', 'note', 'status_change', 'task'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  metadata: {
    oldValue: String,
    newValue: String,
    duration: Number,
    scheduledFor: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for timeline queries
activitySchema.index({ lead: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);