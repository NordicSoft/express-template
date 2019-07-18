let mongodb = require("mongodb"),
    config = require("../lib/config"),
    logger = require("../lib/logger"),
    client = new mongodb.MongoClient(
        config.mongo.connectionString,
        { useNewUrlParser: true }
    );

client.connect(() => {
    logger.info("MongoDB connection opened");
});

module.exports = client;