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
password: {
  type: String,
  required: true,
  select: false, // <-- CRITICAL FOR SECURITY
  minlength: 8,  // <-- Basic validation safety net
},
  staff_Type:{
    type: String,
    required: true,
    trim: true  
  },
  school:{
    type: String,
    require: true,
    trim: true
  }
}, { timestamps: true }); // Automatically handles createdAt and updatedAt for you

module.exports = mongoose.model('staff', staffSchema, 'staff');