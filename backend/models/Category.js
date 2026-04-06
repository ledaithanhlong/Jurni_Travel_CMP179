const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  icon: String, // Icon URL or identifier
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
