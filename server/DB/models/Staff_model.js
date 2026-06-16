const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    default: null
  }
}, { timestamps: true }); // Automatically handles createdAt and updatedAt for you

module.exports = mongoose.model('User', UserSchema);