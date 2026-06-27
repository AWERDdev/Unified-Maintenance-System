require("dotenv").config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Staff = require('../DB/models/Staff_model');
const { loginSchema } = require("../middlewares/security_validation/schemas/auth_schema");
const validate = require("../middlewares/security_validation/auth_input_validation");

const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";
const {authLimiter} = require("../middlewares/rate_limiter/rate_limiter")

router.post("/staff/login",authLimiter, validate(loginSchema, "Staff Login"), async (req, res) => {
    const { national_id, password } = req.body; 
    console.log(`[INFO] [${new Date().toISOString()}] Login attempt initiated for national_id: ${national_id}`);

    try {
        // 1. Find user in the database
        console.log(`[DEBUG] Querying database for user: ${national_id}`);
        const user = await Staff.findOne({ national_id }).select("+password");
        
        if (!user) {
            // FIXED: Since 'user' doesn't exist here, use the input 'national_id' for this log
            console.warn(`[WARN] Login failed: User not found for national_id: ${national_id}`);
            return res.status(401).json({ message: "Invalid National ID or password" });
        }

        // 2. Verify password
        // FIXED: Changed 'email' to 'user.email'
        console.log(`[DEBUG] Verifying password for user: ${user.email}`);
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        
        if (!isPasswordMatch) {
            // FIXED: Changed 'email' to 'user.email'
            console.warn(`[WARN] Login failed: Incorrect password for email: ${user.email}`);
            return res.status(401).json({ message: "Invalid National ID or password" });
        }

        // 3. Generate JWT Token
        // This is perfectly fine! Emails are great for JWT payloads
        console.log(`[DEBUG] Generating JWT token for user: ${user.email}`);
        const token = await jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        // 4. Send cookie to frontend
        console.log(`[DEBUG] Setting authentication cookie for user: ${user.email}`);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.SAMESITE || "lax",
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        console.log(`[INFO] Login process completed successfully for user: ${user.email}`);
        return res.status(200).json({ message: "Login successful" });

    } catch (error) {
        // FIXED: Changed to generic error log or fallback to prevent undefined variable crash
        console.error(`[ERROR] [${new Date().toISOString()}] Login failed status.`);
        console.error(`[ERROR] Error Message: ${error.message}`);
        console.error(`[ERROR] Full Stack Trace:\n`, error.stack);
        
        return res.status(500).json({ message: "Internal server error during login" });
    }
});

module.exports = router;