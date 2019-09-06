const nodemailer = require("nodemailer"),
    SES = require("./aws").SES;

const { AWS_SES_FROM, AWS_SES_SEND_RATE } = process.env;

// create Nodemailer SES transporter
let transporter = nodemailer.createTransport({
    SES,
    sendingRate: AWS_SES_SEND_RATE
});

module.exports = {
    send(to, subject, text, cb = () => { }) {
        return new Promise((resolve, reject) => {
            // Push next messages to Nodemailer
            transporter.on("idle", async () => {
                while (transporter.isIdle()) {
                    try {
                        let info = await transporter.sendMail({
                            from: AWS_SES_FROM,
                            to,
                            subject,
                            text
                        });
                        resolve(info);
                        return cb(null, info);
                    } catch (error) {
                        reject(error);
                        return cb(error);
                    }
                }
            });
        });
    }
};