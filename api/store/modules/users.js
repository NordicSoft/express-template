const Store = require("./../store"),
    logger = require("@logger");

class UsersStore extends Store {
    constructor() {
        logger.debug("UsersStore created");
        super("users");
    }
    async getByEmail(email) {
        return await this.getCollection().findOne({ email });
    }
    async getByUsername(username) {
        return await this.getCollection().findOne({ username });
    }
}

module.exports = new UsersStore();