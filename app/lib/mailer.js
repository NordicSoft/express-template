const nodemailer = require("nodemailer"),
    AWS = require("aws-sdk");


// Configure AWS with your access and secret key.
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_SES_FROM } = process.env;

// Configure AWS to use promise
AWS.config.setPromisesDependency(require("bluebird"));
AWS.config.update({ accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY, region: AWS_REGION });

// create Nodemailer SES transporter
let transporter = nodemailer.createTransport({
    SES: new AWS.SES({
        apiVersion: "2010-12-01"
    }),
    sendingRate: 1 // max 1 messages/second
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