var router = require("express").Router(),
    config = require("@config"),
    logger = require("@logger"),
    store = require("@store");

function signin(req, res) {
    req.signin(function (err, user, info) {
        if (user) {
            return res.status(200).json({}).end();
        } else {
            return res.error(400, { json: { message: info } });
        }
    });
}

router.get("/", function (req, res) {
    return res.render("facade/index");
});

router.get("/gallery", async function (req, res) {
    if (res.locals.photoSets && res.locals.photoSets.length > 0) {
        return res.render("facade/gallery/index");
    }

    // if there are still photos to display (unclassified) - then redirect to /gallery/all
    let allPhotos = await store.photos.all(undefined, false);
    if (allPhotos.length > 0) {
        return res.redirect("/gallery/all");
    }

    return res.error(404);
});

router.get("/gallery/:photoSet", async function (req, res) {
    let photoSet;

    if (req.params.photoSet !== "all") {
        photoSet = await store.photoSets.getByCodeWithPhotos(req.params.photoSet);
    } else {
        photoSet = {
            title: "All photos",
            code: "all",
            photos: await store.photos.all(undefined, false)
        };
    }

    if (!photoSet|| photoSet.photos.length === 0) {
        return res.error(404);
    }

    res.locals.model = {
        photoSet
    };
    return res.render("facade/gallery/photoset");
});

router.get("/gallery/:photoSet/:photoId(\\d+)", async function (req, res) {
    let photoSet, photo;

    if (req.params.photoSet !== "all") {
        photoSet = await store.photoSets.getByCode(req.params.photoSet);
    } else {
        photoSet = { title: "All photos", code: "all" };
    }

    photo = await store.photos.getById(Number(req.params.photoId));

    if (!photoSet || !photo) {
        return res.error(404);
    }

    let nextPhotoId, prevPhotoId;

    if (photoSet.code !== "all") {
        let photos = photoSet.photos,
            currentPhotoIndex = photos.indexOf(photo._id);
        
        nextPhotoId = currentPhotoIndex < photos.length - 1 ?
            photos[currentPhotoIndex + 1]
            : photos[0];
        
        prevPhotoId = currentPhotoIndex > 0 ?
            photos[currentPhotoIndex - 1]
            : photos[photos.length - 1];
    }

    res.locals.model = {
        photoSet,
        photo,
        nextPhotoId,
        prevPhotoId
    };

    return res.render("facade/gallery/photo");
});

router.get("/signin", function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect("/dashboard");
    }
    if (req.xhr) {
        return res.error(404);
    } else {
        //return res.render('signin', { layout: false });
        return res.render("facade/signin");
    }
});

router.get("/register", function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect("/dashboard");
    }
    if (req.xhr) {
        return res.error(404);
    } else {
        return res.render("facade/register");
    }
});

router.get("/check-email", async function (req, res) {
    if (req.xhr) {
        var email = req.query.email,
            user = await store.users.getByEmail(email);
        res.send(!user);
    } else {
        return res.error(404);
    }
});

router.post("/signin", signin);

router.post("/register", async function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect("/dashboard");
    }

    let name = req.body.name,
        email = req.body.email,
        password = req.body.password,
        passwordConfirm = req.body.passwordConfirm;

    logger.info(`Register new user ${name} (${email})`);

    if (password !== passwordConfirm) {
        return res.error(400, { json: { message: "Password and confirm password does not match" } });
    }

    // check username
    if (await store.users.getByEmail(email)) {
        return res.error(400, { json: { message: "This email is already taken" } });
    }

    let usersCollection = await store.users.getCollection();
    let security = require("@lib/security");
    let user = {
        name,
        email,
    };

    switch (config.passwordHashAlgorithm) {
        case "md5":
            user.password = security.md5(password);
            await usersCollection.insertOne(user);
            signin(req, res);
            break;
        case "bcrypt":
            security.bcryptHash(password, async function (err, passwordHash) {
                user.password = passwordHash;
                await usersCollection.insertOne(user);
                signin(req, res);
            });
            break;
        default:
            logger.error("Incorrect passwordHashAlgorithm specified in config.json");
            break;
    }
});

router.post("/send-message", async (req, res) => {
    let axios = require("axios");
    let text = `*${req.body.name}* (_${req.body.email}_) says:\n${req.body.message}`;
    await axios.post(`https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`,
        { chat_id: config.telegram.chatId, text, parse_mode: "Markdown" }
    );
    res.sendStatus(200);
});

router.get("/signout", function (req, res) {
    req.signout();
    return res.redirect("/");
});

router.get("/*", function (req, res) {
    var view = "facade/" + req.url,
        options = {};

    var renderCallback = function (err, html) {
        if (err) {
            if (err.message.indexOf("Failed to lookup view") !== -1) {
                return res.error(404, options);
            }
            throw err;
        }
        res.send(html);
    };

    return res.render(view, options, renderCallback);
});

module.exports = function (express) {
    express.use(async function (req, res, next) {

        let photoSets = await store.photoSets.getNotEmpty(),
            isGalleryVisible = photoSets.length > 0;

        if (!isGalleryVisible) {
            let allPhotos = await store.photos.all(undefined, false);
            isGalleryVisible = allPhotos.length > 0;
        }

        res.locals = res.locals || {};
        Object.assign(res.locals, {
            isGalleryVisible,
            photoSets: await store.photoSets.getNotEmpty()
        });
        next();
    });

    return router;
};