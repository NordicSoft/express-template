var express = require("express"),
    controller = express.Router(),
    logger = require("./../lib/logger"),
    config = require("./../lib/config");


controller.get("/*", function (req, res) {
    res.locals.model = {};
    return res.renderPage("dashboard/index", { layout: "dashboard/_layout" });
});

module.exports = controller;