const express = require("express"),
    router = express.Router(),
    _ = require("lodash"),
    fsPromises = require("fs").promises,
    unlink = fsPromises.unlink,
    rename = fsPromises.rename,
    mkdir = fsPromises.mkdir,
    path = require("path"),
    multer = require("multer"),
    config = require("@config"),
    logger = require("@logger"),
    store = require("@store"),
    uploadPath = config.gallery.uploadPath,
    rootPath = config.gallery.rootPath,
    coversPath = path.resolve(rootPath, config.gallery.photoSetsPath),
    photosPath = path.resolve(rootPath, config.gallery.photosPath),
    trashPath = path.resolve(rootPath, config.gallery.trashPath),
    upload = multer({ dest: uploadPath });

const IMAGE_SIZES = config.gallery.imageSizes.split(",").map(x => { 
    let suffix = x.split(":")[0],
        size = x.split(":")[1];
    return {
        width: Number(size.split("x")[0]),
        height: Number(size.split("x")[1]),
        suffix
    }; 
});

// creates thumbnails and other image sizes
async function resizeImage(sourcePath, outPath) {
    let extension = path.extname(outPath),
        filename = outPath.slice(0, -extension.length);

    switch (config.gallery.imageProcessingModule) {
        case "sharp": {
            const sharp = require("sharp");
            let file = sharp(sourcePath).jpeg({
                quality: config.gallery.jpgQuality,
            });
            for (let size of IMAGE_SIZES) {
                await file
                    .clone()
                    .resize(size.width, size.height, {
                        fit: "inside",
                    })
                    .toFile(`${filename}_${size.suffix}${extension}`);
            }
            break;
        }
        case "jimp": {
            const jimp = require("jimp");
            let file = await jimp.read(sourcePath);
            for (let size of IMAGE_SIZES) {
                await file
                    .clone()
                    .scaleToFit(size.width, size.height)
                    .quality(config.gallery.jpgQuality)
                    .writeAsync(`${filename}_${size.suffix}${extension}`);
            }
            break;
        }
    }
}

async function makeDirs() {
    try {
        await mkdir(coversPath, { recursive: true });
        await mkdir(photosPath, { recursive: true });
        await mkdir(trashPath, { recursive: true });
    } catch (err) {
        console.error(err);
    }
}

makeDirs();

router.get("/photosets", async function (req, res) {
    let photoSets = await store.photoSets.all({code: 1});
    res.json(photoSets);
});

router.get("/photos", async function (req, res) {
    let photos = await store.photos.all();
    return res.json(photos);
});

router.post("/photo", upload.single("file"), async (req, res) => {
    let photo = req.body,
        isNew = !photo._id,
        dbPhoto;

    // parse photo _id
    photo._id = Number(photo._id);
    photo.sets = JSON.parse(photo.sets);

    // TODO: use mongoDB date
    if (isNew) {

        photo.created = new Date();

        // if it's a new photo then save it to get _id
        await store.photos.save(photo);

        // update all related photoSets to include the new photo
        await store.photoSets.updateMany(
            { code: { $in: photo.sets } },
            { $push: { photos: photo._id } }
        );

    } else {

        photo.updated = new Date();

        // get original photo from database
        dbPhoto = await store.photos.getById(photo._id);

        // update all related photoSets
        let addToSets = _.difference(photo.sets,dbPhoto.sets),
            removeFromSets = _.difference(dbPhoto.sets,photo.sets);

        // add photo to `addToSets`
        await store.photoSets.updateMany(
            { code: { $in: addToSets } },
            { $push: { photos: photo._id } }
        );

        // remove photo from `removeFromSets`
        await store.photoSets.updateMany(
            { code: { $in: removeFromSets } },
            { $pull: { photos: photo._id } }
        );

    }

    // save file if present
    if (req.file) {
        const extension = path.extname(req.file.originalname).toLowerCase();

        if (!isNew) {
            // if it's not a new photo then try to backup old photo file
            let dbPhotoPath;
            try {
                dbPhotoPath = path.resolve(config.gallery.rootPath, dbPhoto.src.slice(1));
                await rename(dbPhotoPath, `${trashPath}/${path.basename(dbPhotoPath)}`);
            } catch (err) {
                logger.warn(`Can't backup photo file: ${dbPhotoPath}`);
            }
        }

        // set source file path
        photo.src = `/${config.gallery.photosPath}/${photo._id}${extension}`;
        
        let filename = `${photosPath}/${photo._id}${extension}`;

        await resizeImage(req.file.path, filename);

        // move original photo file
        await rename(req.file.path, filename);
    }

    await store.photos.save(photo);
    return res.json(photo);
});

router.post("/photoset", upload.single("file"), async (req, res) => {
    let photoSet = req.body,
        isNew = !photoSet._id;

    photoSet._id = isNew ? store.ObjectID() : store.ObjectID(photoSet._id);
    if (req.file) {
        const extension = path.extname(req.file.originalname).toLowerCase();

        // if it's not new photoset then backup old cover
        if (!isNew) {
            try {
                let oldPhotoSet = await store.photoSets.getById(photoSet._id),
                    oldPhotoSetCoverPath = path.resolve(config.gallery.rootPath, oldPhotoSet.cover.slice(1));
                await rename(oldPhotoSetCoverPath, `${trashPath}/${path.basename(oldPhotoSetCoverPath)}`);
            } catch (err) {
                // silent
                logger.warn(`can't backup ${photoSet._id} photoset's cover`);
            }
        }

        photoSet.cover = `/${config.gallery.photoSetsPath}/${photoSet._id}${extension}`;
        await rename(req.file.path, `${coversPath}/${photoSet._id}${extension}`);
    }
    if (isNew) {
        photoSet.photos = [];
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

        // remove photo from related photosets
        await store.photoSets.findOneAndUpdate(
            { code: { $in: photo.sets } },
            { $pull: { photos: _id } }
        );

        // delete permanently
        await store.photos.delete(_id);

        if (photo.src) {
            // build path to original file in filesystem
            let src = path.resolve(config.gallery.rootPath, photo.src.slice(1));
        
            // remove thumbnails and other image sizes permanently
            for (let { suffix } of IMAGE_SIZES) {
                try {
                    let extension = path.extname(src);
                    await unlink(`${src.slice(0, -extension.length)}_${suffix}${extension}`);
                } catch (error) {
                    // silent
                }
            }

            try {
                // move original file to trash
                await rename(src, `${trashPath}/${path.basename(src)}`);
            } catch (error) {
                // silent
            }
        }

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
    let photoSet = await store.photoSets.getById(_id);

    // unlink related photos
    await store.photos.updateMany(
        { _id: { $in: photoSet.photos } },
        { $pull: { sets: photoSet.code } }
    );

    // delete photoset permanently
    await store.photoSets.delete(_id);
    return res.json({ _id });
});

router.post("/photos/reorder", async (req, res) => {
    console.log(req.body);
    let photoSetCode = req.body.photoSet,
        photos = req.body.photos;
    await store.photoSets.findOneAndUpdate(
        { code: photoSetCode },
        { $set: { photos } }
    );
    return res.sendStatus(200);
});

module.exports = router;