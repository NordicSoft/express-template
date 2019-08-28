const mongodb = require("mongodb"),
    client = require("./client");

class Store {
    constructor(collectionName) {
        this.collection = client.db().collection(collectionName);
    }
    getCollection() {
        return this.collection;
    }
    async getById(id) {
        return await this.collection.findOne({ _id: mongodb.ObjectID(id) });
    }
    async get(query) {
        return await this.collection.findOne(query);
    }
    async update(_id, changes) {
        return await this.collection.updateOne(
            { _id: mongodb.ObjectID(_id) },
            { $set: changes }
        );
    }
}

module.exports = Store;