const Store = require("./../store"),
    logger = require("./../../lib/logger");

class UsersStore extends Store {
    constructor() {
        logger.debug("UsersStore created");
        super("users");
    }
    async getByEmail(email) {
        return await this.getCollection().findOne({ email: email });
    }
}

module.exports = new UsersStore();