var express = require('express');
var router = express.Router();
const chatModel = require("../models/chat");


router.get('/', async function(req, res) {
    let skip = 0;
    let limit = 5;
    if (req.query.skip && req.query.limit) {
        skip = Number(req.query.skip);
        limit = Number(req.query.limit);
    }
    var response = await chatModel.getLatestChatMessages(skip, limit);
    return res.status(200).json(response);
});

router.post('/', async function(req, res) {
    console.log(req.body);
    var response = await chatModel.insertChatMessage(req.body);
    return res.status(200).json(response);
});

module.exports = router;
