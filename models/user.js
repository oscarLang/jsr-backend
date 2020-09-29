const db = require("../db/database.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const secret = process.env.JWT_SECRET;

async function insertUser(username, email, plainPass) {
    return new Promise(resolve => {
        bcrypt.hash(plainPass, saltRounds, function(err, hash) {
            if (err) {
                resolve({
                    msg: "Hash failed",
                    status: 500,
                    err: err
                });
            }
            db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", username, email, hash, (dbErr) => {
                if (dbErr) {
                    resolve({
                        msg: "Database failed to insert",
                        status: 500,
                        err: dbErr
                    });
                }
                resolve({
                    msg: "Registered user",
                    status: 201
                });
            });
        });
    });
}

async function getUser(email) {
    return new Promise(resolve => {
        db.get("SELECT * FROM users WHERE email = ?", email, (err, row) => {
            if (err) {
                resolve({
                    msg: "Database failed",
                    status: 500,
                    err: true
                });
            }
            if (!row) {
                resolve({
                    msg: "no user found",
                    err: true,
                    status: 404
                });
            } else {
                resolve({
                    msg: "User found",
                    err: false,
                    password: row.password
                });
            }
        });
    });
}

async function checkPass(plain, hash) {
    return new Promise(resolve => {
        let data = {
            isSame: true,
            err: false,
        };
        bcrypt.compare(plain, hash, function(err, result) {
            if(err) {
                data.err = true;
                data.isSame = false;
            } else {
                data.isSame = result;
            }
            resolve(data);
        });
    });
}

module.exports = {
    insertUser: insertUser,
    getUser: getUser,
    checkPass: checkPass,
};
