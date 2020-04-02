const express = require("express"),
    router = express.Router(),
    config = require("@config"),
    store = require("@store");

router.get("/users/can-register", async function (req, res) {
    if (config.registrationMode === "open" || await store.users.count() === 0) {
        return res.send(true).end();
    }
    return res.send(false).end();
});

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
    let usersCount = await store.users.count();
    if (config.registrationMode === "open" || usersCount === 0) {
        let user = req.body;
        if (usersCount === 0) {
            user.role = "owner";
        }
        await store.users.insert(user);
        return res.end();
    }
    return res.sendStatus(404);
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
    let photos = await store.photos.all(undefined, false);
    return res.json(photos);
});

router.get("/gallery/photo/:id", async function (req, res) {
    let photos = await store.photos.getById(Number(req.params.id));
    return res.json(photos);
});


module.exports = router;