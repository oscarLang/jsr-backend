var express = require('express');
var router = express.Router();
const chatModel = require("../models/chat");


router.get('/', async function(req, res) {
    var response = await chatModel.getLatestChatMessages(5);
    return res.status(200).json(response);
});

router.post('/', async function(req, res) {
    console.log(req.body);
    var response = await chatModel.insertChatMessage(req.body);
    return res.status(200).json(response);
});

module.exports = router;
