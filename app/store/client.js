let mongodb = require("mongodb"),
    logger = require("../lib/logger"),
    client = new mongodb.MongoClient(
        process.env.MONGODB_URL,
        { useNewUrlParser: true }
    );

client.connect(() => {
    let server = client.s.options.servers[0];
    logger.info(`MongoDB connection opened: ${server.host}:${server.port}`);
});

module.exports = client;