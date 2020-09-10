var express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var router = express.Router();
const db = new sqlite3.Database('./db/test.sqlite');
const saltRounds = 10;
const secret = process.env.JWT_SECRET;

router.post('/register', function(req, res, next) {
    var email = req.body.email;
    var plainPass = req.body.pass;

    bcrypt.hash(plainPass, saltRounds, function(err, hash) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                data: {
                    msg: "Hash failed",
                    err: err
                }
            });
        }
        db.run("INSERT INTO users (email, password) VALUES (?, ?)", email, hash, (dbErr) => {
            if (dbErr) {
                return res.status(500).json({
                    data: {
                        msg: "Database failed to insert",
                        err: dbErr
                    }
                });
            }
            return res.status(201).json({
                data: {
                    msg: "Registered user"
                }
            });
        });
    });
});

router.post('/login', function(req, res, next) {
    var email = req.body.email;
    var plainPass = req.body.pass;

    if (!email || !plainPass) {
        return res.status(401).json({
            data: {
                msg: "Login failed, all fields must be filled"
            }
        });
    }
    db.get("SELECT * FROM users WHERE email = ?", email, (err, row) => {
        if (err) {
            return res.status(500).json({
                data: {
                    msg: "Database failed",
                    err: err
                }
            });
        }
        if (!row) {
            return res.status(401).json({
                data: {
                    msg: "User not found",
                }
            });
        }
        bcrypt.compare(plainPass, row.password, function(err, result) {
            if(err) {
                return res.status(500).json({
                    data: {
                        msg: "Hash failed",
                        err: err
                    }
                });
            }
            if (result) {
                let payload = { email: email };
                let token = jwt.sign(payload, secret, { expiresIn: '1h'});
                return res.status(200).json({
                    data: {
                        msg: "User logged in!",
                        token: token
                    }
                });
            } else {
                return res.status(401).json({
                    data: {
                        msg: "Wrong password!"
                    }
                });
            }

        });
    });
});

router.get('/all', function(req, res) {
    db.all("SELECT * FROM users", (err, row) => {
        if (err) {
            return false;
        }
        console.log(row);
        res.status(200).json({
            data: {
                msg: "Got a POST request, sending back 201 Created",
                row: row
            }
        });
    });
});

module.exports = router;