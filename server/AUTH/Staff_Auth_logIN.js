require("dotenv").config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Staff = require('../DB/models/Staff_model');
const { loginSchema } = require("../middlewares/security_validation/schemas/auth_schema");
const validate = require("../middlewares/security_validation/auth_input_validation");

const JWT_SECRET = process.env.JWT_SCERET || "JWT_SCERET";

router.get('/', (req, res) => {
    res.json({ message: 'This is the Parent Authentication endpoint Speaking' });
});

router.post("/staff/login", validate(loginSchema, "Staff Login"), async (req, res) => {
    // Destructuring both fields up front makes your variable usage completely uniform
    const { email, password } = req.body; 
    console.log(`[INFO] [${new Date().toISOString()}] Login attempt initiated for email: ${email}`);

    try {
        // 1. Find user in the database
        console.log(`[DEBUG] Querying database for user: ${email}`);
        const user = await Staff.findOne({ email });
        
        if (!user) {
            console.warn(`[WARN] Login failed: User not found for email: ${email}`);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 2. Verify password
        console.log(`[DEBUG] Verifying password for user: ${email}`);
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        
        if (!isPasswordMatch) {
            console.warn(`[WARN] Login failed: Incorrect password for email: ${email}`);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 3. Generate JWT Token
        console.log(`[DEBUG] Generating JWT token for user: ${email}`);
        const token = await jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        // 4. Send cookie to frontend
        console.log(`[DEBUG] Setting authentication cookie for user: ${email}`);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.SAMESITE || "strict",
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        console.log(`[INFO] Login process completed successfully for user: ${email}`);
        return res.status(200).json({ message: "Login successful" });

    } catch (error) {
        console.error(`[ERROR] [${new Date().toISOString()}] Login failed for email: ${email}`);
        console.error(`[ERROR] Error Message: ${error.message}`);
        console.error(`[ERROR] Full Stack Trace:\n`, error.stack);
        
        return res.status(500).json({ message: "Internal server error during login" });
    }
});

module.exports = router;