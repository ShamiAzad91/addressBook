require("dotenv").config()
const { check, validationResult } = require('express-validator');
const User = require("../models/user");
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const SECRET_KEY = "iamgroot";


exports.signup = async(req,res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array()[0].msg });
        }
        
        let userExist = await User.findOne({email:req.body.email})
        if(userExist)
        return res.status(400).json({err:"",message:"user already registered",status:"failed"});

        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(req.body.password,salt);

        let result = await User.create({
            name:req.body.name,
            email:req.body.email,
            password:hashedPassword
        });
    
    let token = jwt.sign({email:result.email,id:result._id},SECRET_KEY,{expiresIn:'2h'});
    return res.status(201).json({user:result, auth:token})       

    }catch(err){
        return res.status(500).json({err:err.message,message:"Something went wrong",status:"failed"})
    }
}


exports.signin = async(req,res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array()[0].msg });
        }
    
        let userExist = await User.findOne({email:req.body.email});
        if(!userExist)
        return res.status(400).json({err:"",message:"user already registered",status:"failed"});

        let verifiedPassword = await bcrypt.compare(req.body.password,userExist.password);
        if(!verifiedPassword)
        return res.status(400).json({err:"",message:"invalid credential",status:"failed"});
        userExist.password = undefined
        let token = jwt.sign({user:userExist.email,id:userExist._id},SECRET_KEY,{expiresIn:"2h"})
        return res.status(200).json({user:userExist,auth:token})
    
    }catch(err){
        return res.status(500).json({err:err.message,message:"Something went wrong",status:"failed"})

    }

}