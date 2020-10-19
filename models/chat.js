const mongo = require("mongodb").MongoClient;
const dsn =  "mongodb://localhost:27017";

const limit = 10;

async function insertChatMessage(message) {
    const client  = await mongo.connect(dsn);
    const db = await client.db('chat');
    const col = await db.collection('history');
    const res = await col.insertOne(message);

    await client.close();
    return res;
}

async function getLatestChatMessages(skip, limit) {
    const client  = await mongo.connect(dsn);
    const db = await client.db('chat');
    const col = await db.collection('history');
    const res = await col.find().sort({'_id':-1}).skip(skip).limit(limit).toArray();

    await client.close();
    return res;
}

module.exports = {
    insertChatMessage: insertChatMessage,
    getLatestChatMessages: getLatestChatMessages
};
