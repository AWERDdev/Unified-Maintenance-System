require("dotenv").config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";
// const { authLimiter } = require("../middlewares/rate_limiter/rate_limiter");

// Note: Ensure `cookie-parser` middleware is registered in your main server file (e.g., app.js / server.js)
router.get('/me',async (req, res) => {
    console.log(`\n[DEBUG] === Incoming GET /me request ===`);
    console.log(`[DEBUG] IP: ${req.ip} | Timestamp: ${new Date().toISOString()}`);

    try {
        // 1. Extract the token from cookies
        console.log(`[DEBUG] Available Cookies:`, req.cookies ? Object.keys(req.cookies) : "req.cookies is UNDEFINED (Check cookie-parser middleware!)");
        const token = req.cookies?.token; 
        
        // 2. If token doesn't exist, return a 401 Unauthorized
        if (!token) {
            console.warn("[DEBUG] Validation failed: No token found in cookies.");
            return res.status(401).json({ 
                authenticated: false, 
                message: "Authentication failed: No token provided." 
            });
        }

        console.log(`[DEBUG] Token found. Length: ${token.length} chars. Attempting verification...`);

        // 3. Verify the token using your secret
        const decodedPayload = jwt.verify(token, JWT_SECRET);
        
        console.log(`[DEBUG] Token verified successfully. User ID: ${decodedPayload.id || 'N/A'}`);
        
        // 4. Return success along with the decoded payload
        return res.status(200).json({
            authenticated: true,
            user: {
                id: decodedPayload.id, 
                email: decodedPayload.email
            }
        });
        
    } catch (error) {
        console.error(`[DEBUG ERROR] Failed to validate user token: ${error.message}`);
        console.error(`[DEBUG ERROR] Stack trace: ${error.stack}`);
        
        // Handle specific JWT expiration or manipulation errors cleanly
        if (error.name === 'TokenExpiredError') {
            console.warn(`[DEBUG] Reason: JWT expired at ${error.expiredAt}`);
            return res.status(401).json({ authenticated: false, message: "Token has expired." });
        }
        
        if (error.name === 'JsonWebTokenError') {
            console.warn(`[DEBUG] Reason: Malformed or invalid JWT signature.`);
        }
        
        return res.status(401).json({ 
            authenticated: false, 
            message: "Authentication failed: Invalid token." 
        });
    }
});

module.exports = router;