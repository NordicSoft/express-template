const mongodb = require("mongodb");

const users = require("./modules/users");
const photoSets = require("./modules/photosets");
const photos = require("./modules/photos");

module.exports = {
    ObjectID: mongodb.ObjectID,
    users,
    photoSets,
    photos
};