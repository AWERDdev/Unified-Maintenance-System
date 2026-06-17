const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  national_id:{
    type: String,
    required:true,
    unique:true,
  },
  legal_name:{
    type: String,
    required: true,
    unique: true,
    trim: true
    
  },
  phone:{
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  staff_Type:{
    type: String,
    required: true,
    trim: true  
  }
}, { timestamps: true }); // Automatically handles createdAt and updatedAt for you

module.exports = mongoose.model('staff', staffSchema);