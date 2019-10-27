const express = require("express"),
    router = express.Router(),
    fsPromises = require("fs").promises,
    rename = fsPromises.rename,
    path = require("path"),
    multer = require("multer"),
    logger = require("./../../lib/logger"),
    config = require("./../../lib/config"),
    store = require("./../../store"),
    uploadPath = path.resolve(process.cwd(), process.env.GALLERY_UPLOAD_PATH),
    rootPath = path.resolve(process.cwd(), process.env.GALLERY_ROOT_PATH),
    coversPath = path.resolve(rootPath, process.env.GALLERY_PHOTOSETS_PATH),
    photosPath = path.resolve(rootPath, process.env.GALLERY_PHOTOS_PATH),
    trashPath = path.resolve(rootPath, process.env.GALLERY_TRASH_PATH),
    upload = multer({ dest: uploadPath });

router.get("/photosets", async function (req, res) {
    let photoSets = await store.photoSets.all();
    res.json(photoSets);
});

router.get("/photos", async function (req, res) {
    let photos = await store.photos.all();
    return res.json(photos);
});

router.post("/photo", upload.single("file"), async (req, res) => {
    let photo = req.body,
        isNew = !photo._id;

    // parse photo _id and sets array
    photo._id = Number(photo._id);
    photo.sets = JSON.parse(photo.sets);

    // TODO: use mongoDB date
    if (isNew) {
        photo.created = new Date();
    } else {
        photo.updated = new Date();
    }

    if (req.file) {
        const relativePhotosPath = path.relative(req.app.get("static-path"), photosPath),
            extension = path.extname(req.file.originalname).toLowerCase();

        if (isNew) {
            // if it's a new photo then save it to get _id
            await store.photos.save(photo);
        } else {
            // if it's not a new photo then backup old photo file
            let oldPhoto, oldPhotoPath;
            try {
                oldPhoto = await store.photos.getById(photo._id);
                oldPhotoPath = path.resolve(req.app.get("static-path"), oldPhoto.src.slice(1));
                await rename(oldPhotoPath, `${trashPath}/${path.basename(oldPhotoPath)}`);
            } catch (err) {
                logger.warn(`Can't backup photo file: ${oldPhotoPath}`);
            }
        }

        // set source file path
        photo.src = `/${relativePhotosPath}/${photo._id}${extension}`;
        await rename(req.file.path, `${photosPath}/${photo._id}${extension}`);
    }

    await store.photos.save(photo);
    console.log(photo);
    return res.json(photo);
});

router.post("/photoset", upload.single("file"), async (req, res) => {
    let photoSet = req.body,
        isNew = !photoSet._id;

    photoSet._id = isNew ? store.ObjectID() : store.ObjectID(photoSet._id);
    if (req.file) {
        const relativeCoversPath = path.relative(req.app.get("static-path"), coversPath),
            extension = path.extname(req.file.originalname).toLowerCase();

        // if it's not new photoset then backup old cover
        if (!isNew) {
            try {
                let oldPhotoSet = await store.photoSets.getById(photoSet._id),
                    oldPhotoSetCoverPath = path.resolve(req.app.get("static-path"), oldPhotoSet.cover.slice(1));
                await rename(oldPhotoSetCoverPath, `${trashPath}/${path.basename(oldPhotoSetCoverPath)}`);
            } catch (err) {
                // silent
                logger.warn(`can't backup ${photoSet._id} photoset's cover`);
            }
        }

        photoSet.cover = `/${relativeCoversPath}/${photoSet._id}${extension}`;
        await rename(req.file.path, `${coversPath}/${photoSet._id}${extension}`);
    }
    await store.photoSets.save(photoSet, isNew);
    return res.json(photoSet);
});

router.post("/photo/restore", async (req, res) => {
    let _id = req.body._id;
    // delete `deleted` property
    await store.photos.update(_id, { $unset: { deleted: true } });
    return res.json({ _id });
});

router.delete("/photo/:id", async (req, res) => {
    let _id = Number(req.params.id);
    let photo = await store.photos.getById(_id);
    // if photo is in trash
    if (photo.deleted) {
        // delete permanently
        await store.photos.delete(_id);
        // move related file to trash
        let src = path.resolve(req.app.get("static-path"), photo.src.slice(1));
        await rename(src, `${trashPath}/${path.basename(src)}`);
        return res.json({ _id });
    } else {
        // set deleted flag to current timestamp
        let { value: { deleted } } = await store.photos.update(
            _id,
            { $currentDate: { deleted: true } }
        );
        return res.json({ _id, deleted });
    }
});

router.delete("/photoset/:id", async (req, res) => {
    let _id = req.params.id;
    await store.photoSets.delete(_id);
    return res.json({ _id });
});

module.exports = router;