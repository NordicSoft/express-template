const Store = require("./../store"),
    logger = require("@logger");

class PhotosStore extends Store {
    constructor() {
        logger.debug("PhotosStore created");
        super("photos");
    }
    async getNextId() {
        let result = await this.client.db().collection("counters").findOneAndUpdate({ _id: "photos" }, { $inc: { last: 1 } }, { upsert: true });
        if (!result.value || ! result.value.last) {
            return 1;
        }
        return result.value.last + 1;
    }
    async insert(docs, options) {
        if (!Array.isArray(docs)) {
            docs = [docs];
        }
        let nextId = await this.getNextId();
        for (let doc of docs) {
            doc._id = nextId;
            nextId++;
        }
        return super.insert(docs, options);
    }
    async all(sort, includeDeleted = true) {
        if (includeDeleted) {
            return super.all(sort || { created: 1 });
        }
        return this.find({ deleted: { $exists: false } }, undefined, sort || { created: 1 });
    }
}

module.exports = new PhotosStore();