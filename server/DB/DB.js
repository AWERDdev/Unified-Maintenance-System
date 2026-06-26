require("dotenv").config();
const mongoose = require("mongoose");

// Fallback to local DB if process.env.MONGODB_URL isn't set
const dbURI = `${process.env.MONGODB_URL}/unified_main` || 'mongodb://localhost:27017/unified_main';

const connect_DB = () => {
  mongoose.connect(dbURI)
    .then(() => console.log('🚀 MongoDB Connected Successfully.'))
    .catch(err => console.error('❌ Database connection error:', err));
};

module.exports = connect_DB;