const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: String,
  lastName: String,
  photoUrl: String,
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  },
  phone: String,
  address: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
