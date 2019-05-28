var express = require("express"),
    controller = express.Router(),
    logger = require("./../lib/logger"),
    config = require("./../lib/config");

controller.get("/test", function (req, res) {
    logger.trace("GET api.test");
    res.json({foo: "bar"});
});


module.exports = controller;