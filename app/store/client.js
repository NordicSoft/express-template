let mongodb = require("mongodb"),
    client = new mongodb.MongoClient(
        process.env.MONGODB_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    );

module.exports = client;