const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')


const index = require('./routes/index');
const reports = require('./routes/reports');
const user = require('./routes/user');

const app = express();
const port = 1337;

var whiteList = ['http://localhost:3000', "https://oscarlang.me"];

var corsOptions = {

	origin: function(origin, callback){
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if(!origin) return callback(null, true);
      if(whiteList.indexOf(origin) === -1){
        var msg = 'The CORS policy for this site does not ' +
                  'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  	credentials: true
}
app.use(cors(corsOptions));
app.use(cookieParser())
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use((req, res, next) => {
    let routesWithoutAuth = [
        "/",
        "/user/register",
        "/user/login",
    ];
    if (routesWithoutAuth.includes(req.path) || req.path.includes("reports/week/")) {
        console.log("no auth");
        return next();
    }
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
                return res.status(500).json({
                    data: {
                        msg: "Jwt verification failed",
                        err: err
                    }
                });
            } else {
                next();
                console.log("auth");
            }
        });
    } else {
        return res.status(401).json({
            data: {
                msg: "No token specified"
            }
        });
    }
});

app.use('/', index);
app.use('/user', user);
app.use('/reports', reports);

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
