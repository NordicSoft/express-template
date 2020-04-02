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
    async find(query, options, sort) {
        let result = await this.collection.find(query, options);
        if (sort) {
            return result.sort(sort).toArray();
        }
        return result.toArray();
    }
    async count(query, options) {
        if (query === undefined && options === undefined) {
            return this.collection.estimatedDocumentCount(query, options);
        }
        return this.collection.countDocuments(query, options);
    }
    async all(sort) {
        return this.find({}, undefined, sort);
    }
    async insert(docs, options) {
        if (!Array.isArray(docs)) {
            docs = [docs];
        }
        return this.collection.insertMany(docs, options);
    }
    async findOneAndUpdate(filter, update, options) {
        return this.collection.findOneAndUpdate(filter, update, options);
    }
    async update(id, changes) {
        if (!Object.keys(changes).every(x => x.startsWith("$"))) {
            changes = { $set: changes };
        }

        return this.findOneAndUpdate(
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
    async updateMany(filter, update, options) {
        return this.collection.updateMany(filter, update, options);
    }
    async delete(id) {
        return this.collection.deleteOne({ _id: typeof id === "string" ? mongodb.ObjectID(id) : id });
    }
}

module.exports = Store;