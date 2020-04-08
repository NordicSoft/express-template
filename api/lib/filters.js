const config = require("@config"),
    logger = require("@logger");

function signinRequired(req, res, next) {
    if (!req.isAuthenticated()) {
        logger.info("Signin is required");
        if (req.xhr) {
            return res.status(401).json({}).end();
        } else {
            var url = require("url"),
                querystring = require("querystring"),
                redirectUrl = "/signin",
                path = url.parse(req.originalUrl).path;

            if (path) {
                redirectUrl += "?return=" + querystring.escape(path);
            }
            console.log("redirectUrl", path);
            return res.redirect(redirectUrl);
        }
    }
    next();
}

function xhrOnly(req, res, next) {
    if (!req.xhr) {
        return res.error(404);
    }
    next();
}

function facadeOnly(req, res, next) {
    if (req.headers.authorization !== "Bearer " + config.facadeToken) {
        return res.sendStatus(401);
    }
    next();
}

module.exports = {
    signinRequired,
    xhrOnly,
    facadeOnly
};

