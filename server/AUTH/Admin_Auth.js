const express = require('express');
const router = express.Router();
// const Admin = require('../../models/admin_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.json({ message: 'This is the Admin Authentication endpoint Speaking' });
});


module.exports = router;