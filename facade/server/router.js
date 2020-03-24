var logger = require("@logger");

module.exports = function (express) {
    logger.info("Init Router");

    // eslint-disable-next-line no-unused-vars
    var signinRequired = function (req, res, next) {
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
    };

    // eslint-disable-next-line no-unused-vars
    var xhrOnly = function (req, res, next) {
        if (!req.xhr) {
            return res.error(404);
        }
        next();
    };

    express.use("/", require("./routes/facade")(express));

    // handle 404
    express.use(function (req, res) {
        var options = {};
        if (!req.isAuthenticated()) {
            options.layout = "_layout";
        }
        return res.error(404, options);
    });

    // handle 500
    // eslint-disable-next-line no-unused-vars
    // next parameter is required to work correctly
    // eslint-disable-next-line no-unused-vars
    express.use(function (err, req, res, next) {

        var options = {};
        /*if (!req.isAuthenticated()) {
            options.layout = "_layout";
        }*/

        if (err.code == "MODULE_NOT_FOUND") {
            return res.error(404, options);
        }

        logger.error("Express Error Middleware");
        logger.error(err);

        return res.error(500, options);
    });
};
