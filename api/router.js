const logger = require("@logger"),
    { signinRequired, xhrOnly, facadeOnly } = require("@lib/filters");

module.exports = function (express) {
    logger.info("Init Router");

    express.use("/profile", xhrOnly, signinRequired, require("./routes/profile"));
    express.use("/gallery", xhrOnly, signinRequired, require("./routes/gallery"));
    express.use("/facade", facadeOnly, require("./routes/facade"));
    express.use("/auth", require("./routes/auth"));
    express.use("/", signinRequired, require("./routes"));

    // handle 404
    express.use(function (req, res) {
        return res.error(404);
    });

    // handle 500
    // eslint-disable-next-line no-unused-vars
    // next parameter is required to work correctly
    // eslint-disable-next-line no-unused-vars
    express.use(function (err, req, res, next) {
        if (err.code == "MODULE_NOT_FOUND") {
            return res.error(404);
        }

        logger.error("Express Error Middleware");
        logger.error(err);

        return res.error(500);
    });
};
