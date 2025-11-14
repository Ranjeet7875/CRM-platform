const Notification = require('../models/Notification');

const createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    
    // Emit to socket if available
    if (global.io) {
      global.io.to(data.recipient.toString()).emit('notification', notification);
    }
    
    return notification;
  } catch (error) {
    console.error('Notification creation failed:', error);
  }
};

const getNotifications = async (userId, unreadOnly = false) => {
  const query = { recipient: userId };
  if (unreadOnly) query.read = false;
  
  return await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(50);
};

const markAsRead = async (notificationId, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { read: true },
    { new: true }
  );
};

module.exports = { createNotification, getNotifications, markAsRead };