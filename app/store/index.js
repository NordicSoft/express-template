var mongodb = require("mongodb")
    config = require("./../lib/config");

async function connect(){
    let client = new mongodb.MongoClient(
        config.mongo.connectionString,
        { useNewUrlParser: true }
    );
    await client.connect();
    return client;
}

async function getUsersCollections() {
    let client = await connect();
    return client.db("express-template").collection("users");
}

module.exports = {
    getUsers: getUsersCollections,
    getUserById: async function(id) {
        let usersCollection = await getUsersCollections();
        return await usersCollection.findOne({_id: mongodb.ObjectID(id)});
    },
    getUserByEmail: async function(email) {
        let usersCollection = await getUsersCollections();
        return await usersCollection.findOne({email: email});
    },
    getUser: async function(query) {
        let usersCollection = await getUsersCollections();
        return await usersCollection.findOne(query);
    }
};