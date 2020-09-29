const reportModel = require("../models/reports");
var express = require('express');
var router = express.Router();

router.get('/week/:week_id', async function(req, res) {
    let id = Number(req.params.week_id);
    var response = await reportModel.get(id);
    return res.status(response.status).json({
        data: {
            text: response.text,
            msg: response.msg
        }
    });
});

router.post('/', async function(req, res) {
    var week = Number(req.body.week);
    var text = req.body.text;
    if (!week || !text) {
        return res.status(401).json({
            data: {
                msg: "Operation failed. All fields must be filled"
            }
        });
    }
    var response = await reportModel.insert(week, text);
    return res.status(response.status).json({
        data: {
            msg: response.msg
        }
    });
});

router.put('/', async function(req, res) {
    var week = Number(req.body.week);
    var text = req.body.text;
    if (!week || !text) {
        return res.status(401).json({
            data: {
                msg: "Operation failed. All fields must be filled"
            }
        });
    }
    var response = await reportModel.update(week, text);
    return res.status(response.status).json({
        data: {
            msg: response.msg
        }
    });

});

router.delete('/', async function(req, res) {
    var week = Number(req.body.week);
    if (!week) {
        return res.status(401).json({
            data: {
                msg: "Operation failed. All fields must be filled"
            }
        });
    }
    var response = await reportModel.delete(week);
    return res.status(response.status).json({
        data: {
            msg: response.msg
        }
    });

});
module.exports = router;
