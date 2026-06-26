require("dotenv").config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";
const staff = require("../DB/models/Staff_model");

router.get("/fetch/data", async (req, res) => {
    try {
        console.log("[debug] fetching user data");
        const token = req.cookies?.token;

        // 1. If token doesn't exist, return a 401 Unauthorized
        if (!token) {
            console.log("Validation failed: No token found in cookies.");
            return res.status(401).json({ 
                authenticated: false, 
                message: "Authentication failed: No token provided." 
            });
        }
        
        // 2. Verify the token using your secret
        const decodedPayload = jwt.verify(token, JWT_SECRET);

        // FIXED typo: changed 'eamil' to 'email'
        const user = await staff.findOne({ email: decodedPayload.email });

        if (!user) {
            console.log(`[debug] user with this email wasn't found ${decodedPayload.email}`);
            return res.status(404).json({ message: "User profile not found." });
        }

        // 3. Return the scoped details safely
        return res.status(200).json({
            staff_type: user.staff_Type,
            staff_school: user.school
        });

    } catch (error) {
        console.log(`[debug] failed to fetch user data ${error}`);
        
        // Always send a response in the catch block so the frontend client doesn't freeze
        return res.status(401).json({ message: "Session expired or invalid authorization." });
    }
});

// FIXED typo: added the missing 's' to exports
module.exports = router;