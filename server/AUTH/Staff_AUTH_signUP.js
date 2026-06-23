require("dotenv").config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const validate = require("../middlewares/security_validation/auth_input_validation")
const {signupSchema} = require("../middlewares/security_validation/schemas/auth_schema")
const Staff = require('../DB/models/Staff_model');
const {authLimiter} = require("../middlewares/rate_limiter/rate_limiter")

// Load the mock whitelist data from the JSON file
const whitelist = require('./allowed_staff.json'); 

const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";

router.post("/staff/signup",authLimiter,validate(signupSchema, "Staff Signup"),  async (req, res) => {
    const data = req.body; // Cleaner approach, good catch!
    
    console.log(`[INFO] Signup attempt initiated for national ID: ${data.national_id}`);

    try {
        // 1. Search the JSON file for the national_id
        const whitelistedUser = whitelist.find(user => user.national_id === data.national_id);
        
        // 2. Reject if they are not in your JSON file
        if (!whitelistedUser) {
            return res.status(403).json({ 
                message: "Access Denied: Your National ID is not registered in the school system list." 
            });
        }

        // 3. FIXED: Changed 'national_id' to 'data.national_id'
        const existingUser = await Staff.findOne({ national_id: data.national_id });
        if (existingUser) {
            return res.status(400).json({ message: "An account with this National ID already exists." });
        }

        // 4. Hash the password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashed_password = await bcrypt.hash(data.password, salt);
        
        // 5. Build and Save the new staff member using your Mongoose Schema
        const newStaff = new Staff({
            ...data,
            password: hashed_password,
            staff_Type: whitelistedUser.staff_Type 
        });
        
        await newStaff.save();
        // FIXED: Changed 'email' to 'data.email'
        console.log(`[INFO] Staff account created successfully in MongoDB for ${data.email}`);

        // 6. FIXED: Changed 'email' to 'data.email' inside JWT generation
        const token = await jwt.sign({ email: data.email }, JWT_SECRET, { expiresIn: "1h" });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.SAMESITE || "strict",
            maxAge: 60 * 60 * 1000
        });

        return res.status(200).json({ message: "Signup successful" });

    } catch (error) {
        console.error(`[ERROR] Signup failed: ${error.message}`);
        return res.status(500).json({ message: "Failed to signup user. Please try again later." });
    }
});

module.exports = router;