const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['booking', 'order_status', 'promotion', 'other'], 
    default: 'other' 
  },
  isRead: { type: Boolean, default: false },
  actionUrl: { type: String }, // For linking to a specific tour or booking
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
