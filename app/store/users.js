const mongodb = require("mongodb"),
    client = require("./client"),
    logger = require("./../lib/logger");

class UsersStore {
    constructor() {
        logger.debug('UsersStore created');
    }
    getCollection() {
        return client.db().collection("users");
    }
    async getById(id) {
        return await this.getCollection().findOne({ _id: mongodb.ObjectID(id) });
    }
    async getByEmail(email) {
        return await this.getCollection().findOne({ email: email });
    }
    async get(query) {
        return await this.getCollection().findOne(query);
    }
    async update(_id, changes) {
        return await this.getCollection().updateOne(
            { _id: mongodb.ObjectID(_id) },
            { $set: changes }
        );
    }
}

module.exports = new UsersStore();