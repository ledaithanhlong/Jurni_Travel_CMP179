const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clerkId: { type: String, required: true },
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  totalPrice: { type: Number, required: true },
  guests: { type: Number, default: 1 },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  transactionId: String
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
