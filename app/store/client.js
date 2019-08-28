let mongodb = require("mongodb"),
    logger = require("../lib/logger"),
    client = new mongodb.MongoClient(
        process.env.MONGODB_URL,
        { useNewUrlParser: true }
    );

module.exports = client;