const mongodb = require("mongodb");

const users = require("./modules/users");
const content = require("./modules/content");
const photoSets = require("./modules/photosets");
const photos = require("./modules/photos");

module.exports = {
    ObjectID: mongodb.ObjectID,
    users,
    content,
    photoSets,
    photos
};