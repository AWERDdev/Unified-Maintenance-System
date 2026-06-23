const rateLimit = require('express-rate-limit');

// 1. HIGH SECURITY LIMITER (Login, Signup)
const authLimiter = rateLimit({
  // Read from .env, fallback to a strict 15 minutes if missing
  windowMs: parseInt(process.env.AUTH_WINDOW_MS) || 15 * 60 * 1000, 
  // Read from .env, fallback to a strict 5 attempts if missing
  max: parseInt(process.env.AUTH_MAX_REQUESTS) || 5, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    message: "Too many authentication attempts. Please try again later." 
  }
});

// 2. GENERAL GLOBAL LIMITER (GET, PUT, PATCH)
const generalLimiter = rateLimit({
  // Read from .env, fallback to 5 minutes if missing
  windowMs: parseInt(process.env.GEN_WINDOW_MS) || 5 * 60 * 1000, 
  // Read from .env, fallback to 100 requests if missing
  max: parseInt(process.env.GEN_MAX_REQUESTS) || 100, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    message: "Calm down, you are sending requests too quickly!" 
  }
});

module.exports = {
  authLimiter,
  generalLimiter
};