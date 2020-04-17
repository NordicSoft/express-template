const Store = require("./../store"),
    logger = require("@logger");

class ContentStore extends Store {
    constructor() {
        logger.debug("ContentStore created");
        super("content");
    }

    async getByCode(code) {
        return await this.getCollection().findOne({ code: code });
    }
}

module.exports = new ContentStore();