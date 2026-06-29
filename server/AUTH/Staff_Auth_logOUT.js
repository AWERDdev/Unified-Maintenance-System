require("dotenv").config();
const express = require('express');
const router = express.Router();

router.post("/staff/logout", (req, res) => {
    console.log(`[INFO] [${new Date().toISOString()}] Logout request received`);

    const isProd = process.env.NODE_ENV === "production";

    res.clearCookie('token', {
        httpOnly: true,
        secure: isProd ? true : false,
        sameSite: isProd ? "none" : "lax",
    });

    console.log(`[INFO] Authentication cookie cleared successfully`);
    return res.status(200).json({ message: "Logout successful" });
});

module.exports = router;
