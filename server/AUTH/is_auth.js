require("dotenv").config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";
const { authLimiter } = require("../middlewares/rate_limiter/rate_limiter");

// Note: Ensure `cookie-parser` middleware is registered in your main server file (e.g., app.js / server.js)
router.get('/me', authLimiter, async (req, res) => {
    try {
        // 1. Extract the token from cookies (fixed typo from 'toekn')
        // Safe navigation with '?.' ensures it doesn't crash if req.cookies is undefined
        const token = req.cookies?.token; 
        
        // 2. If token doesn't exist, return a 401 Unauthorized
        if (!token) {
            console.log("Validation failed: No token found in cookies.");
            return res.status(401).json({ 
                authenticated: false, 
                message: "Authentication failed: No token provided." 
            });
        }

        // 3. Verify the token using your secret
        // If it's invalid or expired, jwt.verify automatically throws an error, jumping to the catch block
        const decodedPayload = jwt.verify(token, JWT_SECRET);
        
        // 4. Return success along with the decoded payload (e.g., userId, role)
        // Your frontend utility will read this 200 status to confirm the user is auth'd
        return res.status(200).json({
            authenticated: true,
            user: {
                id: decodedPayload.id, // adjusting depending on what you store in your JWT payload
                email: decodedPayload.email
            }
        });
        
    } catch (error) {
        console.error(`Failed to validate user token: ${error.message}`);
        
        // Handle specific JWT expiration or manipulation errors cleanly
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ authenticated: false, message: "Token has expired." });
        }
        
        return res.status(401).json({ 
            authenticated: false, 
            message: "Authentication failed: Invalid token." 
        });
    }
});

module.exports = router;