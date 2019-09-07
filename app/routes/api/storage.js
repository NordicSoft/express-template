const nodePath = require("path"),
    multer = require("multer"),
    upload = multer({
        dest: nodePath.resolve(process.cwd(), process.env.FILEBROWSER_UPLOAD_PATH)
    });

module.exports = function (router) {

    router.get("/storage/local/list", async function (req, res) {
        const root = nodePath.resolve(process.cwd(), process.env.FILEBROWSER_ROOT_PATH),
            fs = require("fs"),
            util = require("util"),
            readdir = util.promisify(fs.readdir),
            stat = util.promisify(fs.stat);

        let path = req.query.path,
            dirs = [],
            files = [];

        if (path[path.length - 1] !== "/") {
            path += "/";
        }

        let items = await readdir(root + path, { withFileTypes: true });

        for (let item of items) {
            let isFile = item.isFile(),
                isDir = item.isDirectory();

            if (!isFile && !isDir) {
                return;
            }

            let result = {
                type: isFile ? "file" : "dir",
                path: path + item.name,
            };

            result.basename = result.name = nodePath.basename(result.path);

            if (isFile) {
                let fileStat = await stat(root + result.path);
                result.size = fileStat.size;
                result.extension = nodePath.extname(result.path).slice(1);
                result.name = nodePath.basename(result.path, "." + result.extension);
                files.push(result);
            } else {
                result.path += "/";
                dirs.push(result);
            }
        }

        return res.json(dirs.concat(files));
    });

    router.post("/storage/local/upload", upload.array("files"), async function (req, res) {
        const root = nodePath.resolve(process.cwd(), process.env.FILEBROWSER_ROOT_PATH),
            fs = require("fs"),
            util = require("util"),
            rename = util.promisify(fs.rename);

        let path = req.query.path;

        for (let file of req.files) {
            await rename(file.path, root + path + file.originalname);
        }

        return res.sendStatus(200);
    });

    router.post("/storage/local/delete", async function (req, res) {
        const root = nodePath.resolve(process.cwd(), process.env.FILEBROWSER_ROOT_PATH),
            unlink = require("fs").promises.unlink;

        let path = req.query.path;

        await unlink(root + path);

        return res.sendStatus(200);
    });

    router.get("/storage/s3/list", async function (req, res) {
        const S3 = require("./../../lib/aws").S3;

        let path = req.query.path,
            dirs = [],
            files = [];

        let data = await S3.listObjectsV2({
            Delimiter: "/",
            Prefix: path.slice(1)
        }).promise();

        for (let prefix of data.CommonPrefixes) {
            let dir = {
                type: "dir",
                path: "/" + prefix.Prefix
            };
            dir.basename = dir.name = nodePath.basename(dir.path);
            dirs.push(dir);
        }

        for (let item of data.Contents.filter(item => item.Key != data.Prefix)) {
            let file = {
                type: "file",
                path: path + item.Key,
                size: item.Size,
                lastModified: item.LastModified,
                eTag: item.ETag
            };
            file.basename = nodePath.basename(file.path);
            file.extension = nodePath.extname(file.path).slice(1);
            file.name = nodePath.basename(file.path, "." + file.extension);
            files.push(file);
        }
        return res.json(dirs.concat(files));
    });

    router.post("/storage/s3/upload", upload.array("files"), async function (req, res) {
        const S3 = require("./../../lib/aws").S3,
            fs = require("fs");

        let path = req.query.path.slice(1);

        for (let file of req.files) {
            var fileStream = fs.createReadStream(file.path);
            await S3.upload({
                Key: path + file.originalname,
                Body: fileStream
            }).promise();
        }

        return res.sendStatus(200);
    });

    router.post("/storage/s3/delete", async function (req, res) {
        const S3 = require("./../../lib/aws").S3;

        let path = req.query.path.slice(1);

        await S3.deleteObject({Key: path}).promise();

        return res.sendStatus(200);
    });

};