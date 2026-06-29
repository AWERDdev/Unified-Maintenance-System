const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  asset: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  date: {
    type: String,
    required: true
  },
  arCategory: {
    type: String,
    required: true
  },
  adminApproved: {
    type: Boolean,
    required: true,
    default: false
  },
  principalFunded: {
    type: Boolean,
    required: true,
    default: false
  },
  cost: {
    type: Number,
    required: true
  },
  
  school: {
    type: String,
    required: true,
    index: true // Indexing this makes school-wide queries incredibly fast
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'staff',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema, 'tickets');
