const express = require("express"),
    router = express.Router(),
    store = require("@store");

router.get("/", async (req, res) => {
    let content = await store.content.all({ code: 1 });
    res.json(content);
});

router.get("/:code", async (req, res) => {
    let content = await store.content.getByCode(req.params.code);

    if (content) {
        return res.json(content);
    }

    return res.sendStatus(404);
});

router.post("/", async (req, res) => {
    let content = {
        code: req.body.code,
        text: req.body.text
    };

    if (req.body._id) {
        content._id = store.ObjectID(req.body._id);
    }

    console.log(content);

    await store.content.save(content);
    console.log(content);
    return res.json(content);
});

module.exports = router;