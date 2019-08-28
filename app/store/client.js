let mongodb = require("mongodb"),
    client = new mongodb.MongoClient(
        process.env.MONGODB_URL,
        { useNewUrlParser: true }
    );

module.exports = client;