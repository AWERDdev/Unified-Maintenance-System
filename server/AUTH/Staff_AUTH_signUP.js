require("dotenv").config()

const express = require('express');
const router = express.Router();


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signupschema = require("../middlewares/security_validation/schemas/signup")
const validate = require("../middlewares/security_validation/auth_input_validation")
const Staff = require('../DB/models/Staff_model');

const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET"


router.post("/staff/signup",(validate(signupschema)), async (req, res) =>{
    try{
    const data = req.body
    
    const token = await jwt.sign({email:data.email},JWT_SECRET,{expiresIn:"1h"})

    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const hashed_password = await bcrypt.hash(data.password,salt)
    
    console.log(`hashed password ${hashed_password} token created: ${token}`)
    
    const newStaff = new Staff({
        ...data,
        password:hashed_password
    })

    await newStaff.save()

    res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:process.env.SAMESITE || "strict",
        maxAge: 60 * 60 * 1000
    })
    res.status(200).json({message:"signup up successful"})
    }catch(error){
        console.log(`failed to sign user ${error}`)
        return res.status(500).json({message:`failed to signup user please try again later${error}`,})
    }
    
})

module.exports = router;