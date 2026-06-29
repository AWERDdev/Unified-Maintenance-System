require("dotenv").config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";
const staff = require("../DB/models/Staff_model");

async function getAuthenticatedStaff(req, res) {
    const token = req.cookies?.token;

    if (!token) {
        res.status(401).json({
            authenticated: false,
            message: "Authentication failed: No token provided."
        });
        return null;
    }

    let decodedPayload;
    try {
        decodedPayload = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
        console.error("[DEBUG ERROR] JWT verification failed:", jwtError.message);
        res.status(401).json({ message: "Session expired or invalid authorization." });
        return null;
    }

    if (!decodedPayload.email) {
        res.status(400).json({ message: "Invalid token payload structure." });
        return null;
    }

    const user = await staff.findOne({ email: decodedPayload.email });

    if (!user) {
        res.status(404).json({ message: "User profile not found." });
        return null;
    }

    return user;
}

router.get("/fetch/status", async (req, res) => {
    console.log("\n--- [DEBUG START] GET /fetch/status ---");
    try {
        const user = await getAuthenticatedStaff(req, res);
        if (!user) return;

        console.log(`[DEBUG] User found. DB Schema Fields -> staff_Type: ${user.staff_Type}, school: ${user.school}`);
        console.log("--- [DEBUG END] Success ---\n");

        return res.status(200).json({
            staff_type: user.staff_Type,
            staff_school: user.school
        });
    } catch (error) {
        console.error(`[DEBUG CRITICAL ERROR] Route execution crashed: ${error.stack || error}`);
        console.log("--- [DEBUG END] Exception Raised ---\n");
        return res.status(500).json({ message: "Internal server error during status verification." });
    }
});

router.get("/fetch/profile", async (req, res) => {
    console.log("\n--- [DEBUG START] GET /fetch/profile ---");
    try {
        const user = await getAuthenticatedStaff(req, res);
        if (!user) return;

        console.log(`[DEBUG] Profile fetched for: ${user.email}`);
        console.log("--- [DEBUG END] Success ---\n");

        return res.status(200).json({
            legal_name: user.legal_name,
            national_id: user.national_id,
            phone: user.phone,
            email: user.email,
            staff_type: user.staff_Type,
            staff_school: user.school,
            created_at: user.createdAt
        });
    } catch (error) {
        console.error(`[DEBUG CRITICAL ERROR] Route execution crashed: ${error.stack || error}`);
        console.log("--- [DEBUG END] Exception Raised ---\n");
        return res.status(500).json({ message: "Internal server error during profile retrieval." });
    }
});

module.exports = router;