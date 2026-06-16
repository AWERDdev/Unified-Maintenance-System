const express = require('express');
const router = express.Router();
// const Parent = require('../../models/Parent_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signupschema = require("../middlewares/security_validation/schemas/signup")
const validate = require("../middlewares/security_validation/auth_input_validation")

const JWT_SCERET = process.env.JWT_SCERET || "JWT_SCERET"

router.get('/', (req, res) => {
    res.json({ message: 'This is the Parent Authentication endpoint Speaking' });
});


router.post("/staff/signup",(validate(signupschema)), async (req, res) =>{
    try{
    const data = req.body
    
    const token = await jwt.sign({email:data.email},JWT_SCERET,{expiresIn:"1h"})

    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const hashed_password = await bcrypt.hash(data.password,saltRounds)
    
    console.log(`hashed password ${hashed_password} token created: ${token}`)
    res.status(200).json({message:"signup successful user signed in",token:token})
    
    }catch(error){
        console.log(`failed to sign user ${error}`)
        return res.status(500).json({message:`failed to signup user please try again later${error}`,})
    }
    
})

module.exports = router;