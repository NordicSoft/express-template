// change process' current dir
process.chdir(__dirname);

// load environment variables from `.env`
require("dotenv-defaults").config();

// init config
var config = require("./app/lib/config");

// init logger
var logger = require("./app/lib/logger").init(config.logFilesPath + "all.log");

logger.info("Express Template v%s started%s. Path: %s", config.version, process.env.RUNNING_FOREVER ? " as daemon" : "", process.cwd());
if (config.useProcessEnv) {
    logger.info("Environment vars: %s=%s, %s=%s",
        config.processEnvVar,
        process.env[config.processEnvVar],
        config.processPortVar,
        process.env[config.processPortVar]
    );
}

logger.info("Environment: " + config.env);

// connect to MongoDB
require("./app/store/client").connect((err, client) => {
    if (err) {
        logger.error("MongoDB connection failed:");
        logger.error(err);
        return;
    }

    let mongoServer = client.s.options.servers[0];
    logger.info(`MongoDB connection opened: ${mongoServer.host}:${mongoServer.port}`);

    // init Express
    var express = require("./app/express")(config);
    var server = require("http").createServer(express);

    // init sessions
    var expressSession = require("express-session");
    var sessionStore;

    switch (config.session.store) {
        case "memory":
            // leave sessionStore undefined
            break;
        case "redis":
            var RedisStore = require("connect-redis")(expressSession);
            sessionStore = new RedisStore(config.redis);
            break;
    }

    var session = expressSession({
        secret: config.session.secret,
        key: config.session.key,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
    });

    express.use(session);

    // init Socket.IO
    require("./app/io").init(server, session);

    // init authentication module
    require("./app/lib/auth")(express);

    // define global response locals
    var devCacheHash = require("crypto").randomBytes(20).toString("hex").slice(0, 7);
    express.use(function (req, res, next) {
        if (req.user && req.user.config) {
            //req.user.config.foo = "bar";
        }

        res.locals = {
            config: config,
            lang: require("./app/langs").en,
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
            production: "production" === config.env,
            cacheHash: "production" === config.env ? config.commit : devCacheHash
        };
        next();
    });

    // init Express' routes
    require("./app/router")(express);

    // start HTTP-server
    server.listen(config.port);
    server.on("listening", function () {
        logger.info("Express server listening on port " + config.port);
    });

});

// handle errors

process.on("uncaughtException", function (error) {
    logger.error("uncaughtException");
    logger.error(error);
    /*errorManagement.handler.handleError(error);
    if(!errorManagement.handler.isTrustedError(error))
        process.exit(1);*/
});

process.on("unhandledRejection", function (reason, p) {
    logger.error("unhandledRejection");
    logger.error(reason);
    logger.error(p);
});