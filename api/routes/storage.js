const express = require("express"),
    router = express.Router(),
    config = require("@config"),
    vuetifyFileBrowserSDK = require("vuetify-file-browser-server/sdk");

let localStorage = new vuetifyFileBrowserSDK.LocalStorage(
        config.fileBrowser.rootPath
    ),
    s3Storage = new vuetifyFileBrowserSDK.S3Storage(
        config.aws.accessKeyId,
        config.aws.secretAccessKey,
        config.aws.region,
        config.aws.s3Bucket
    );

// setup routes
router.use(
    vuetifyFileBrowserSDK.Router([localStorage, s3Storage], {
        uploadPath: config.fileBrowser.uploadPath,
    })
);

module.exports = router;
