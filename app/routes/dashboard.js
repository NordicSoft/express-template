var express = require("express"),
    router = express.Router();


router.get("/*", function (req, res) {
    res.locals.model = {};
    return res.render("dashboard/index", { layout: "dashboard/_layout" });
});

module.exports = router;