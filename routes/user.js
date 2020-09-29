var express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require("../models/user");


var router = express.Router();
const db = new sqlite3.Database('./db/test.sqlite');
const saltRounds = 10;
const secret = process.env.JWT_SECRET;

router.post('/register', async function(req, res, next) {
    var username = req.body.username;
    var email = req.body.email;
    var plainPass = req.body.password;
    var response = await userModel.insertUser(username, email, plainPass);
    return res.status(response.status).json({
        data: {
            msg: response.msg
        }
    });

});

router.post('/login', async function(req, res, next) {
    var email = req.body.email;
    var plainPass = req.body.password;

    if (!email || !plainPass) {
        return res.status(401).json({
            data: {
                msg: "Login failed, all fields must be filled"
            }
        });
    }
    var user = await userModel.getUser(email);
    if (user.err) {
        return res.status(user.status).json({
            data: {
                msg: response.msg
            }
        });
    }
    var passCheck = await userModel.checkPass(plainPass, user.password);
    if (passCheck.err) {
        return res.status(500).json({
            data: {
                msg: "Hash failed",
                err: err
            }
        });
    }
    if (passCheck.isSame) {
        let payload = { email: email };
        let token = jwt.sign(payload, secret, { expiresIn: '12h'});
        // console.log(token);
        let cookieSettings = {maxAge: 604800000};
        if (process.env.NODE_ENV === 'production') {
            cookieSettings.secure = true;
            cookieSettings.domain = ".oscarlang.me";
        }
        return res.status(200).cookie('jwt', token, cookieSettings).send("OK");
    } else {
        return res.status(401).json({
            data: {
                msg: "Wrong password!"
            }
        });
    }
});
module.exports = router;
