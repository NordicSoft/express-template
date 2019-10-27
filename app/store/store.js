const mongodb = require("mongodb"),
    client = require("./client");


class Store {
    constructor(collectionName) {
        this.client = client;
        this.collection = client.db().collection(collectionName);
    }
    getCollection() {
        return this.collection;
    }
    async getById(id) {
        return this.collection.findOne({ _id: typeof id === "string" ? mongodb.ObjectID(id) : id });
    }
    async findOne(query, options) {
        return this.collection.findOne(query, options);
    }
    async find(query, options) {
        return this.collection.find(query, options);
    }
    async all() {
        return (await this.find({})).toArray();
    }
    async insert(docs, options) {
        if (!Array.isArray(docs)) {
            docs = [docs];
        }
        return this.collection.insertMany(docs, options);
    }
    async update(id, changes) {
        if (!Object.keys(changes).every(x => x.startsWith("$"))) {
            changes = { $set: changes };
        }

        return this.collection.findOneAndUpdate(
            { _id: typeof id === "string" ? mongodb.ObjectID(id) : id },
            changes,
            { returnOriginal: false }
        );
    }
    async save(doc, forceInsert = false) {
        if (forceInsert || !doc._id) {
            return this.insert(doc);
        }
        return this.update(doc._id, doc);
    }
    async delete(id) {
        return this.collection.deleteOne({ _id: typeof id === "string" ? mongodb.ObjectID(id) : id });
    }
}

module.exports = Store;