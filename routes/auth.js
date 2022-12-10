const express = require("express");
const router = express.Router();
const {signup,signin} = require("../controllers/auth");
const { check, validationResult } = require('express-validator');

router.post("/signup",[
check('name').isLength({min:3}).withMessage(' name must be at least 3 chars long'),
check('email').isEmail().withMessage('email is required'),
check('password').isLength({min:5}).withMessage('password must be at least 5 chars long'),

],signup);


router.post("/signin",[
    check('email').isEmail().withMessage('email is required'),
    check('password').isLength({min:5}).withMessage('password must be at least 5 chars long'),
    
    ],signin);

module.exports = router;