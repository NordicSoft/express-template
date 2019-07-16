var express = require("express"),
    router = express.Router(),
    logger = require("./../lib/logger"),
    config = require("./../lib/config"),
    store = require("./../store");

router.get("/profile", function (req, res) {
    var user = req.user;
    res.json({
        name: user.name,
        email: user.email
    });
});

router.post("/profile", async function (req, res) {
    var user = req.body;
    user._id = req.user._id;
    console.log(user);
    let result = await store.updateUser(user);
    console.log(result.modifiedCount);
    res.sendStatus(200);
});

module.exports = router;