const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, default: 0 },
  startTime: Date,
  endTime: Date,
  location: String,
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
