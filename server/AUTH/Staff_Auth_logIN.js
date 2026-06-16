const express = require('express');
const router = express.Router();
// const Parent = require('../../models/Parent_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SCERET = process.env.JWT_SCERET || "JWT_SCERET"

router.get('/', (req, res) => {
    res.json({ message: 'This is the Parent Authentication endpoint Speaking' });
});

router.post("/staff/login",async (req, res) =>{
    try{
    const data = req.body
    
    const token = await jwt.sign(JWT_SCERET,data.email)

    const saltRounds = 10
    const salt = await bcrypt.genSaltSync(saltRounds)
    const hashed_password = bcrypt.hash(data.password,saltRounds)
    
    res.status(200).json({message:"signup successful user signed in",token:token})
    
    }catch(error){
        console.log(`failed to sign user ${error}`)
        return res.status(500).json({message:"failed to signup user please try again later"})
    }
    
})

module.exports = router;