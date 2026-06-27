require("dotenv").config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";
const staff = require("../DB/models/Staff_model");

router.get("/fetch/status", async (req, res) => {
    console.log("\n--- [DEBUG START] GET /fetch/status ---");
    try {
        // Log raw incoming cookies to check if cookie-parser is working
        console.log("[DEBUG] Incoming cookies:", req.cookies);
        const token = req.cookies?.token;

        // 1. If token doesn't exist, return a 401 Unauthorized
        if (!token) {
            console.warn("[DEBUG WARNING] Validation failed: No token found in cookies.");
            return res.status(401).json({ 
                authenticated: false, 
                message: "Authentication failed: No token provided." 
            });
        }
        
        console.log("[DEBUG] Token found. Attempting JWT verification...");
        
        // 2. Verify the token using your secret
        let decodedPayload;
        try {
            decodedPayload = jwt.verify(token, JWT_SECRET);
            console.log("[DEBUG] JWT verified successfully. Payload:", decodedPayload);
        } catch (jwtError) {
            console.error("[DEBUG ERROR] JWT verification failed:", jwtError.message);
            return res.status(401).json({ message: "Session expired or invalid authorization." });
        }

        // Validate that email actually exists on the payload
        if (!decodedPayload.email) {
            console.warn("[DEBUG WARNING] Token payload is missing 'email' field.");
            return res.status(400).json({ message: "Invalid token payload structure." });
        }

        console.log(`[DEBUG] Querying database for staff email: ${decodedPayload.email}`);
        const user = await staff.findOne({ email: decodedPayload.email });

        if (!user) {
            console.warn(`[DEBUG WARNING] User with email [${decodedPayload.email}] was not found in DB.`);
            return res.status(404).json({ message: "User profile not found." });
        }

        // Log specific properties of the found user document to confirm fields match
        console.log(`[DEBUG] User found. DB Schema Fields -> staff_Type: ${user.staff_Type}, school: ${user.school}`);

        // 3. Return the scoped details safely
        console.log("[DEBUG SUCCESS] Sending user data back to client.");
        console.log("--- [DEBUG END] Success ---\n");
        
        return res.status(200).json({
            staff_type: user.staff_Type,
            staff_school: user.school
        });

    } catch (error) {
        console.error(`[DEBUG CRITICAL ERROR] Route execution crashed: ${error.stack || error}`);
        console.log("--- [DEBUG END] Exception Raised ---\n");
        
        // Always send a response in the catch block so the frontend client doesn't freeze
        return res.status(500).json({ message: "Internal server error during status verification." });
    }
});

module.exports = router;