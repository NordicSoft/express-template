var crypto = require("crypto"),
    partial = require("./utils").partial;

function hash(algorithm, data, encoding) {
    return crypto.createHash(algorithm).update(data).digest(encoding || "base64");
}

var sha256 = partial(hash, "sha256", undefined);
var sha512 = partial(hash, "sha512", undefined);
var md5 = partial(hash, "md5", undefined, "hex");

function bcryptHash(password, callback) {
    var bcrypt = require("bcrypt");
    bcrypt.hash(password, 10, callback);
}

function bcryptCheck(password, hash, callback) {
    var bcrypt = require("bcrypt");
    bcrypt.compare(password, hash, callback);
}

module.exports = {
    hash: hash,
    md5: md5,
    sha256: sha256,
    sha512: sha512,
    bcryptHash: bcryptHash,
    bcryptCheck: bcryptCheck
};