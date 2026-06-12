const express = require('express');
const router = express.Router();
// const Parent = require('../../models/Parent_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.json({ message: 'This is the Parent Authentication endpoint Speaking' });
});


module.exports = router;