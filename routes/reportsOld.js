var express = require('express');
const sqlite3 = require('sqlite3').verbose();

var router = express.Router();
const db = new sqlite3.Database('./db/test.sqlite');
router.get('/week/:week_id', function(req, res) {
    let id = Number(req.params.week_id);
    db.get("SELECT text_data FROM reports WHERE week = ?;", id, (err, row) => {
        if (err) {
            return res.status(500).json({
                data: {
                    error: err,
                }
            });
        }
        if (row == null) {
            return res.status(401).json({
                data: {
                    msg: "No report with week id " + req.params.week_id ,
                }
            });
        }

        return res.status(200).json({
            data: {
                text: row.text_data
            }
        });
    });
});

router.post('/', function(req, res) {
    var week = Number(req.body.week);
    var text = req.body.text;
    if (!week || !text) {
        return res.status(401).json({
            data: {
                msg: "Operation failed. All fields must be filled"
            }
        });
    }
    db.run("INSERT INTO reports (week, text_data) VALUES (?, ?)", week, text, (err) => {
        if (err) {
            return res.status(500).json({
                data: {
                    msg: "Database failed to insert",
                    err: err
                }
            });
        }
        res.status(201).json({
            data: {
                msg: "Got a POST request, sending back 201 Created"
            }
        });
    });
});

router.put('/', function(req, res) {
    var week = Number(req.body.week);
    var text = req.body.text;
    if (!week || !text) {
        return res.status(401).json({
            data: {
                msg: "Operation failed. All fields must be filled"
            }
        });
    }
    db.run("UPDATE reports SET text_data = ? WHERE week = ?", text, week, (err) => {
        if (err) {
            return res.status(500).json({
                data: {
                    msg: "Database failed to update",
                    err: err
                }
            });
        }
        res.status(201).json({
            data: {
                msg: "Got a PUT request, sending back 201 Created"
            }
        });
    });
});

router.delete('/', function(req, res) {
    var week = Number(req.body.week);
    if (!week) {
        return res.status(401).json({
            data: {
                msg: "Operation failed. All fields must be filled"
            }
        });
    }
    db.run("DELETE FROM reports WHERE week = ?", week, (err) => {
        if (err) {
            return res.status(500).json({
                data: {
                    msg: "Database failed to delete",
                    err: err
                }
            });
        }
        res.status(200).json({
            data: {
                msg: "Got a DELETE request"
            }
        });
    });
});
module.exports = router;
