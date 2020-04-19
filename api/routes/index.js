const express = require("express"),
    router = express.Router();

router.post("/send-email", async (req, res) => {
    let subject = req.body.subject,
        message = req.body.message;

    const mailer = require("@lib/mailer");
    await mailer.send(req.user.email, subject, message);
    return res.sendStatus(200);
});

module.exports = router;