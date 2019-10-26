const express = require("express"),
    path = require("path"),
    router = express.Router(),
    vuetifyFileBrowserSDK = require("vuetify-file-browser-server/sdk");

router.post("/send-email", async function (req, res) {
    let subject = req.body.subject,
        message = req.body.message;

    const mailer = require("./../../lib/mailer");
    await mailer.send(req.user.email, subject, message);
    return res.sendStatus(200);
});

require("./profile")(router);
router.use("/gallery", require("./gallery"));

// get AWS configuration from process.env
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET } = process.env;
 
// setup routes
router.use("/storage", vuetifyFileBrowserSDK.Router([
    new vuetifyFileBrowserSDK.LocalStorage(path.resolve(process.cwd(), process.env.FILEBROWSER_ROOT_PATH)),
    new vuetifyFileBrowserSDK.S3Storage(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET)
], {
    uploadPath: path.resolve(process.cwd(), process.env.FILEBROWSER_UPLOAD_PATH)
}));

module.exports = router;