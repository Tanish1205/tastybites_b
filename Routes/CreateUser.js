require ('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret= process.env.JWTSECRET; 

router.post('/createuser', [body('email', 'invalid email').isEmail(),
body('name', 'username must be at least 5 characters').isLength({ min: 5 }),
body('password', 'passowrd must be at least 5 characteres long').isLength({ min: 5 })],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const salt = await bcrypt.genSalt(10); 
        let secPwd = await bcrypt.hash(req.body.password, salt); 

        try {
            await User.create({  //function of model
                name: req.body.name,
                location: req.body.location,
                email: req.body.email,
                password: secPwd
            })
            res.json({ success: true });
        } catch (error) {
            console.log(error);
            res.json({ success: false });
        }
    })

    router.post('/loginuser', [body('email', 'invalid email').isEmail(),
        body('password', 'passowrd must be at least 5 characteres long').isLength({ min: 5 })],
            async (req, res) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                let email = req.body.email;
                try {
                    let user_curr = await User.findOne({ email });
                    if (!user_curr) {
                        return res.status(400).json({ errors: "Incorrect email" });
                    }
                    const pwdCompare = await bcrypt.compare(req.body.password, user_curr.password); 
                    if (!pwdCompare) {
                        return res.status(400).json({ errors: "Incorrect password" });
                    }

                    const data = {
                        user: {
                            id:user_curr.id
                        }
                    }
                    const authToken = jwt.sign(data, jwtSecret); 

                    return res.json({ success: true, authToken: authToken });
                } catch (error) {
                    console.log(error);
                    res.json({ success: false });
                }
            })
        

module.exports = router;