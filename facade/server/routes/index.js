const router = require("express").Router(),
    config = require("@config"),
    api = require("@api"),
    { addFilenameSuffix } = require("@utils");

router.get("/", function (req, res) {
    return res.render("index");
});

router.get("/gallery", async function (req, res) {
    if (res.locals.photoSets && res.locals.photoSets.length > 0) {
        let lastPhotos = await api.photos.all(
            `created:${config.gallery.newPhotosFirst ? -1 : 1}`,
            0,
            config.gallery.lastPhotosCount);

        // load the smallest thumbnail by default
        for (let photo of lastPhotos) {
            photo.src = addFilenameSuffix(photo.src, config.gallery.defaultPhotoThumbnailSuffix);
        }

        res.locals.model = {
            lastPhotos
        };
        return res.render("gallery/index");
    }

    // if there are still photos to display (unclassified) - then redirect to /gallery/all
    let allPhotosCount = await api.photos.count();
    if (allPhotosCount > 0) {
        return res.redirect("/gallery/all");
    }

    return res.error(404);
});

router.get("/gallery/:photoSet", async function (req, res) {
    let photoSet;

    if (req.params.photoSet !== "all") {
        photoSet = await api.photoSets.getWithPhotos(req.params.photoSet);
            
        if (photoSet && photoSet.photos && config.gallery.newPhotosFirst) {
            photoSet.photos.reverse();
        }
    } else {
        photoSet = {
            title: "All photos",
            code: "all",
            photos: await api.photos.all(`created:${config.gallery.newPhotosFirst ? -1 : 1}`)
        };
    }

    if (!photoSet|| !photoSet.photos || photoSet.photos.length === 0) {
        return res.error(404);
    }

    // load the smallest thumbnail by default
    for (let photo of photoSet.photos) {
        photo.src = addFilenameSuffix(photo.src, config.gallery.defaultPhotoThumbnailSuffix);
    }

    res.locals.model = {
        photoSet
    };
    return res.render("gallery/photoset");
});

router.get("/gallery/:photoSet/:photoId(\\d+)", async function (req, res) {
    let photoSet = await api.photoSets.get(req.params.photoSet),
        photo = await api.photos.get(req.params.photoId);

    if (!photoSet || !photo) {
        return res.error(404);
    }

    if (config.gallery.newPhotosFirst && photoSet.photos) {
        photoSet.photos.reverse();
    }

    let photos = photoSet.photos,
        currentPhotoIndex = photos.indexOf(photo._id);
        
    let nextPhotoId = currentPhotoIndex < photos.length - 1 ?
        photos[currentPhotoIndex + 1]
        : photos[0];
        
    let prevPhotoId = currentPhotoIndex > 0 ?
        photos[currentPhotoIndex - 1]
        : photos[photos.length - 1];

    photo.src = addFilenameSuffix(photo.src, config.gallery.defaultPhotoSuffix);

    res.locals.model = {
        photoSet,
        photo,
        nextPhotoId,
        prevPhotoId
    };

    return res.render("gallery/photo");
});

router.post("/send-message", async (req, res) => {
    let axios = require("axios");
    let text = `*${req.body.name}* (_${req.body.email}_) says:\n${req.body.message}`;
    await axios.post(`https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`,
        { chat_id: config.telegram.chatId, text, parse_mode: "Markdown" }
    );
    res.sendStatus(200);
});

router.get("/*", function (req, res) {
    let view = req.url.startsWith("/") ?  req.url.slice(1) : req.url,
        options = {};

    let renderCallback = function (err, html) {
        if (err) {
            console.log(err);
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

        let photoSets = await api.photoSets.all("order"),
            isGalleryVisible = photoSets.length > 0;

        if (!isGalleryVisible) {
            let allPhotosCount = await api.photos.count();
            isGalleryVisible = allPhotosCount > 0;
        }

        res.locals = res.locals || {};
        Object.assign(res.locals, {
            isGalleryVisible,
            photoSets
        });
        next();
    });

    return router;
};