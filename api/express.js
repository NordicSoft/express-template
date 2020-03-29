var express = require("express"),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    methodOverride = require("method-override"),
    errorHandler = require("errorhandler"),
    cors = require("cors"),
    compression = require("compression");

module.exports = function (config) {

    var app = express();

    // set Express properties
    app.set("env", config.env);
    app.set("port", config.port);
    app.set("x-powered-by", false);
    app.set("view cache", true);

    // on production app is behind a front-facing proxy, so use X-Forwarded-* header to determine client's IP
    app.set("trust proxy", config.prod);

    // TODO: setup API CORS properly
    app.use(cors({origin: true, credentials: true}));

    // init cookie parser
    app.use(cookieParser());

    // init Gzip compression
    app.use(compression({ level: 2 }));

    // parse incoming request body
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // simulate DELETE and PUT
    app.use(methodOverride());

    // for development environment
    if (config.dev) {
        // init error handler
        app.use(errorHandler());
    }


    // custom middlewares
    app.use(function (req, res, next) {

        res.error = function (status, options) {
            options = options || {};
            if (req.xhr) {
                return res.status(status).json(options.json || {}).end();
            }
            return res.sendStatus(404);
        };

        next();
    });

    return app;
};
