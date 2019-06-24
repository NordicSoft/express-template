var express = require("express"),
    path = require("path"),
    morgan = require("morgan"),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    methodOverride = require("method-override"),
    favicon = require("serve-favicon"),
    errorHandler = require("errorhandler"),
    hbs = require("express-hbs"),
    cors = require('cors'),
    compression = require("compression");
    //router = require('./router');
    //langs = require('./langs');

module.exports = function(config) {

    var app = express();

    // set Express properties
    app.set("env", config.env);
    app.set("port", config.port);
    app.set("x-powered-by", false);
    app.set("view cache", true);

    // on production app is behind a front-facing proxy, so use X-Forwarded-* header to determine client's IP
    app.set("trust proxy", "production" === config.env);

    // enable CORS
    app.use(cors());

    // setup Handlebars view engine (express-hbs)
    app.engine("html", hbs.express4({
        partialsDir: process.cwd() + "/views",
        layoutsDir: process.cwd() + "/views",
        defaultLayout: process.cwd() + "/views/welcome/_layout",
        extname: ".html",
    }));
    app.set("view engine", "html");
    app.set("views", process.cwd() + "/views");

    // set favicon
    app.use(favicon(process.cwd() + "/www/favicon.ico"));

    // set the static files location /www/img will be /img for users
    app.use(express.static(path.join(process.cwd(), "www")));

    // log every request to the console and forever's log
    morgan.token("user", function (req) {
        return req.user ? req.user._id.toString() : "?";
    });
    morgan.format("production", ":date[iso] :method :url :status - :res[content-length]bytes :response-time[3]ms ip=:remote-addr user=:user referrer=:referrer agent=:user-agent");
    app.use(morgan("production" === config.env ? "production" : "dev"));

    // init cookie parser
    app.use(cookieParser());

    // init Gzip compression
    app.use(compression({level: 2}));

    // parse incoming request body
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // simulate DELETE and PUT
    app.use(methodOverride());

    // for development environment
    if ("development" === config.env) {
        // init error handler
        app.use(errorHandler());
    }


    // add Response extensions
    app.use(function (req, res, next) {   

        res.renderPartial = function (view, options, callback) {
            if (!options) options = {};

            if (typeof options == "function") {
                callback = options;
                options = {};
            }

            options.layout = false;
            res.render(view, options, function (err, str, yields) {
                if (err) {
                    if (typeof callback == "function") {
                        callback(err);
                    }
                    return req.next(err);
                }
                var json = {
                    data: str,
                    yields: yields
                };
                if (typeof callback == "function") {
                    return callback(null, json);
                }
                return res.json(json);
            });
        };

        res.renderPage = function (view, options, callback) {
            if (typeof options == "function") {
                callback = options;
                options = {};
            }
            if (req.xhr) {
                return res.renderPartial(view, options, callback);
            } else {
                return res.render(view, options, callback);
            }
        };

        res.error = function (status, options, callback) {
            options = options || {};
            if (typeof options == "function") {
                callback = options;
                options = {};
            }
            if (req.xhr) {
                return res.status(status).json(options.json || {}).end();
            } else {
                return res.status(status).render(status.toString(), options, callback);
            }
        };

        next();
    });

    return app;
};
