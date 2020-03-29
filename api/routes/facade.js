const express = require("express"),
    router = express.Router(),
    store = require("@store");

router.get("/user/:usernameOrEmail", async function (req, res) { 
    let usernameOrEmail = req.params.usernameOrEmail,
        user;

    if (usernameOrEmail.includes("@")) {
        user = await store.users.getByEmail(usernameOrEmail);
    } else {
        user = await store.users.getByUsername(usernameOrEmail);
    }

    if (user) {
        return res.json(user);
    }

    return res.sendStatus(404);
});

router.post("/user", async function (req, res) { 
    let user = req.body;
    await store.users.insert(user);
    return res.end();
});


router.get("/gallery/photosets/not-empty", async function (req, res) {
    let photoSets = await store.photoSets.getNotEmpty();
    return res.json(photoSets);
});

router.get("/gallery/photoset/:code", async function (req, res) {
    let photoSet;
    if (req.query.photos === "true") {
        photoSet = await store.photoSets.getByCodeWithPhotos(req.params.code);
    } else {
        photoSet = await store.photoSets.getByCode(req.params.code);
    }
    return res.json(photoSet);
});


router.get("/gallery/photos", async function (req, res) {
    let photos = await store.photos.all();
    return res.json(photos);
});

router.get("/gallery/photo/:id", async function (req, res) {
    let photos = await store.photos.getById(Number(req.params.id));
    return res.json(photos);
});


module.exports = router;