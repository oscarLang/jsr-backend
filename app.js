const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

const index = require('./routes/index');
const hello = require('./routes/hello');
const user = require('./routes/user');

const app = express();
const port = 1337;


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());

if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use((req, res, next) => {
    let routesWithoutAuth = [
        "/",
        "/user/register",
        "/user/login"
    ];
    if (routesWithoutAuth.includes(req.path)) {
        console.log("no auth");
        return next();
    }
    const token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
                return res.status(500).json({
                    data: {
                        msg: "Jwt verification failed",
                        err: err
                    }
                });
            }
            console.log("auth");
            next();
        });
    }
});

app.use('/', index);
app.use('/hello', hello);
app.use('/user', user);

app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});

// Start up server
app.listen(port, () => console.log(`Example API listening on port ${port}!`));
