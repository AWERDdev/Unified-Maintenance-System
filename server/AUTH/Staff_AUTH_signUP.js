require("dotenv").config();

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {signupSchema} = require("../middlewares/security_validation/schemas/auth_schema");
const validate = require("../middlewares/security_validation/auth_input_validation");
const Staff = require('../DB/models/Staff_model');

const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";

router.post("/staff/signup", validate(signupSchema), async (req, res) => {
    const { email } = req.body;
    
    // 1. Debug entry point
    console.log(`[INFO] [${new Date().toISOString()}] Signup attempt initiated for email: ${email}`);

    try {
        const data = req.body;
        
        // 2. JWT Generation Log
        console.log(`[DEBUG] Generating JWT token for ${email}...`);
        const token = await jwt.sign({ email: data.email }, JWT_SECRET, { expiresIn: "1h" });

        // 3. Password Hashing Log
        console.log(`[DEBUG] Hashing password for ${email}...`);
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashed_password = await bcrypt.hash(data.password, salt);
        
        // 4. Database Save Log
        console.log(`[DEBUG] Saving new staff member ${email} to database...`);
        const newStaff = new Staff({
            ...data,
            password: hashed_password
        });
        await newStaff.save();
        console.log(`[INFO] Database record created successfully for ${email}`);

        // 5. Cookie Setup Log
        console.log(`[DEBUG] Setting authentication cookie for ${email}...`);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.SAMESITE || "strict",
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        console.log(`[INFO] Signup process completed successfully for ${email}`);
        return res.status(200).json({ message: "Signup successful" });

    } catch (error) {
        // 6. Comprehensive Error Logging
        console.error(`[ERROR] [${new Date().toISOString()}] Signup failed for email: ${email}`);
        console.error(`[ERROR] Error Message: ${error.message}`);
        console.error(`[ERROR] Full Stack Trace:\n`, error.stack);
        
        // Pro-tip: Keep your client error messages clean; don't leak raw database/system errors to users
        return res.status(500).json({ 
            message: "Failed to signup user. Please try again later." 
        });
    }
});

module.exports = router;