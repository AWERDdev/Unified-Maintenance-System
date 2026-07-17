const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  asset: {
    type: String,
    required: true,
    trim: true
  },
  room: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ["IT_Equipment" , "Electrical" , "Plumbing" , "Furniture" , "Structural"]
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending_Approval', 'Approved', 'In_Progress', 'Resolved'],
    default: 'Pending_Approval'
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
    required: true,
    min: 0,
    default: 0
  },
  school: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'staff',
    required: true
  }
}, { timestamps: true }); // This handles your dates automatically!

module.exports = mongoose.model('Ticket', ticketSchema, 'tickets');