var nimn = require("./nimn");

exports.compress = function (data, schema) {
    return nimn.stringify(nimn.buildSchema(schema), data);
};

exports.decompress = function (data, schema) {
    return nimn.parse(nimn.buildSchema(schema), data);
};