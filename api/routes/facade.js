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
    let photoSet,
        code = req.params.code;
    
    if (code === "all") {
        photoSet = { title: "All photos", code: "all" };
        if (req.query.photos === "true") {
            photoSet.photos = await store.photos.all(undefined, false);
        } else {
            let photos = await store.photos.all(undefined, false, { projection: { _id: 1 } });
            photoSet.photos = photos.map(x => x._id);
        }
    } else {
        photoSet = req.query.photos === "true"
            ? await store.photoSets.getByCodeWithPhotos(code)
            : await store.photoSets.getByCode(code);
    }

    return res.json(photoSet);
});


router.get("/gallery/photos", async function (req, res) {
    let sortStr = req.query.sort,
        sort = sortStr ? [sortStr.split(":")[0], parseInt(sortStr.split(":")[1])] : undefined,
        skip = req.query.skip ? parseInt(req.query.skip) : undefined,
        limit = req.query.limit ? parseInt(req.query.limit) : undefined;

    let photos = await store.photos.all(sort, false, { skip, limit });
    return res.json(photos);
});

router.get("/gallery/photo/:id", async function (req, res) {
    let photos = await store.photos.getById(Number(req.params.id));
    return res.json(photos);
});


module.exports = router;