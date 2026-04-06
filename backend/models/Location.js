const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  image: String,
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);
