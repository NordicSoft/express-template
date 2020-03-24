let mongodb = require("mongodb"),
    config = require("@config"),
    client = new mongodb.MongoClient(
        config.mongoDb.url,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    );

module.exports = client;