const express = require("express"),
    router = express.Router(),
    config = require("@config"),
    vuetifyFileBrowserSDK = require("vuetify-file-browser-server/sdk");

router.post("/send-email", async function (req, res) {
    let subject = req.body.subject,
        message = req.body.message;

    const mailer = require("@lib/mailer");
    await mailer.send(req.user.email, subject, message);
    return res.sendStatus(200);
});

// get AWS configuration from process.env
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET } = process.env;
 
// setup routes
router.use("/storage", vuetifyFileBrowserSDK.Router([
    new vuetifyFileBrowserSDK.LocalStorage(config.fileBrowser.rootPath),
    new vuetifyFileBrowserSDK.S3Storage(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET)
], {
    uploadPath: config.fileBrowser.uploadPath
}));

module.exports = router;