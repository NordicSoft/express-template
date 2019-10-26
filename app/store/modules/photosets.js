const Store = require("./../store"),
    logger = require("./../../lib/logger");

class PhotoSetsStore extends Store {
    constructor() {
        logger.debug("PhotoSetsStore created");
        super("photosets");
    }
    async getByCode(code) {
        return await this.getCollection().findOne({ code: code });
    }
}

module.exports = new PhotoSetsStore();