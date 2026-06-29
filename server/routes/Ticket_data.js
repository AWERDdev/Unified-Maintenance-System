require("dotenv").config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";
const staff = require("../DB/models/Staff_model");
const Ticket = require("../DB/models/Ticket_model");

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

router.post("/tickets/create", async (req, res) => {
    console.log("\n--- [DEBUG START] POST /routes/tickets/create ---");
    try {
        const user = await getAuthenticatedStaff(req, res);
        if (!user) return;
        
        const allowedRoles = ["Administrator", "IT Specialist", "Teacher", "School Counselor", "Librarian", "Teacher Assistant", "Academic Coordinator"];
        if (!allowedRoles.includes(user.staff_Type)) { 
            return res.status(403).json({ message: "Unauthorized access." });
         }

        const { asset, room, category, arCategory, cost } = req.body;

        if (!asset || !room || !category || !arCategory || cost === undefined) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const ticketId = `TK-${Math.floor(1000 + Math.random() * 9000)}`;
        const today = new Date().toISOString().split('T')[0];

        const newTicket = new Ticket({
            id: ticketId,
            asset,
            room,
            category,
            arCategory,
            cost,
            status: "Pending",
            date: today,
            adminApproved: false,
            principalFunded: false,
            createdBy: user._id
        });

        await newTicket.save();

        console.log(`[DEBUG] Ticket created: ${ticketId}`);
        console.log("--- [DEBUG END] Success ---\n");

        return res.status(201).json(newTicket);
    } catch (error) {
        console.error(`[DEBUG CRITICAL ERROR] Route execution crashed: ${error.stack || error}`);
        console.log("--- [DEBUG END] Exception Raised ---\n");
        return res.status(500).json({ message: "Internal server error during ticket creation." });
    }
});

router.get("/tickets/my", async (req, res) => {
    console.log("\n--- [DEBUG START] GET /routes/tickets/my ---");
    try {
        const user = await getAuthenticatedStaff(req, res);
        if (!user) return;

        // Added .populate() here so teachers can also see their names/emails on their cards
        const tickets = await Ticket.find({ createdBy: user._id })
            .populate('createdBy', 'legal_name email');

        console.log(`[DEBUG] Found ${tickets.length} tickets for user: ${user.email}`);
        console.log("--- [DEBUG END] Success ---\n");

        return res.status(200).json(tickets);
    } catch (error) {
        console.error(`[DEBUG CRITICAL ERROR] Route execution crashed: ${error.stack || error}`);
        return res.status(500).json({ message: "Internal server error during ticket retrieval." });
    }
});

router.get("/tickets/all", async (req, res) => {
    console.log("\n--- [DEBUG START] GET /routes/tickets/all ---");
    try {
        const user = await getAuthenticatedStaff(req, res);
        if (!user) return;

        const allowedRoles = ["Super Admin", "Administrator", "IT Specialist", "Principal", "Vice Principal", "Teacher"];
        if (!allowedRoles.includes(user.staff_Type)) { 
            return res.status(403).json({ message: "Unauthorized access to ticket registry." });
        }

        let query = {};
        
        // Populate links legal_name and email directly. Date is a flat field on the ticket model.
        const tickets = await Ticket.find(query)
            .populate('createdBy', 'legal_name email');

        console.log(`[DEBUG] Found ${tickets.length} tickets for role [${user.staff_Type}]`);
        return res.status(200).json(tickets);
    } catch (error) {
        console.error(`[DEBUG CRITICAL ERROR] Route execution crashed: ${error.stack || error}`);
        return res.status(500).json({ message: "Internal server error during ticket retrieval." });
    }
});

router.patch("/tickets/:id/approve", async (req, res) => {
    console.log("\n--- [DEBUG START] PATCH /routes/tickets/:id/approve ---");
    try {
        const user = await getAuthenticatedStaff(req, res);
        if (!user) return;

        const { id } = req.params;

        const ticket = await Ticket.findOne({ id });

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }

        // Admin/IT Specialist logic
        const adminRoles = ["Administrator", "IT Specialist"];
        if (adminRoles.includes(user.staff_Type)) {
            ticket.adminApproved = true;
        }

        // Principal/Vice Principal logic
        const principalRoles = ["Principal", "Vice Principal"];
        if (principalRoles.includes(user.staff_Type)) {
            ticket.principalFunded = true;
        }

        // Dynamic status progression
        if (ticket.adminApproved && ticket.principalFunded && ticket.status === "Pending") {
            ticket.status = "In Progress";
        }

        await ticket.save();

        console.log(`[DEBUG] Ticket updated: ${ticket.id}`);
        console.log("--- [DEBUG END] Success ---\n");

        return res.status(200).json(ticket);
    } catch (error) {
        console.error(`[DEBUG CRITICAL ERROR] Route execution crashed: ${error.stack || error}`);
        console.log("--- [DEBUG END] Exception Raised ---\n");
        return res.status(500).json({ message: "Internal server error during ticket update." });
    }
});

router.patch("/tickets/:id/resolve", async (req, res) => {
    console.log("\n--- [DEBUG START] PATCH /routes/tickets/:id/resolve ---");
    try {
        const user = await getAuthenticatedStaff(req, res);
        if (!user) return;

        const allowedRoles = ["Super Admin", "Administrator", "IT Specialist"];
        if (!allowedRoles.includes(user.staff_Type)) { 
            return res.status(403).json({ message: "Unauthorized access." });
        }

        const { id } = req.params;

        // Try finding by custom id first, then by _id
        let ticket = await Ticket.findOne({ id });
        if (!ticket) {
            ticket = await Ticket.findById(id);
        }

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }

        ticket.status = "Resolved";
        await ticket.save();

        console.log(`[DEBUG] Ticket resolved: ${ticket.id}`);
        console.log("--- [DEBUG END] Success ---\n");

        return res.status(200).json(ticket);
    } catch (error) {
        console.error(`[DEBUG CRITICAL ERROR] Route execution crashed: ${error.stack || error}`);
        console.log("--- [DEBUG END] Exception Raised ---\n");
        return res.status(500).json({ message: "Internal server error during ticket resolve." });
    }
});

module.exports = router;
