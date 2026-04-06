const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  duration: String,
  location: String,
  images: [String],
  category: { type: String, enum: ['flight', 'hotel', 'car', 'activity'] },
  availableSlots: { type: Number, default: 10 },
  externalKey: { type: String },
  externalSource: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Tour', tourSchema);
