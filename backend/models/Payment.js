const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['vnpay', 'credit_card', 'cash'], default: 'cash' },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  transactionId: { type: String }, // For third-party payment gateways
  details: { type: Object }, // Store raw payment provider response if needed
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
