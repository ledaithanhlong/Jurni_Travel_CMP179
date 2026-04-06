const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceType: {
    type: String,
    required: true,
    enum: ['hotel', 'flight', 'car', 'activity', 'tour', 'other']
  },
  serviceId: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

favoriteSchema.index({ userId: 1, serviceType: 1, serviceId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
