const AWS = require("aws-sdk");

// Configure AWS with your access and secret key.
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET } = process.env;
AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION
});

// Create a new service objects
const S3 = new AWS.S3({
        apiVersion: "2006-03-01",
        params: { Bucket: AWS_S3_BUCKET }
    }),
    SES = new AWS.SES({
        apiVersion: "2010-12-01"
    });

module.exports = {
    S3,
    SES
};