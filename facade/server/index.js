// change process' current dir
const path = require("path");
process.chdir(path.resolve(__dirname, ".."));

// load environment variables from `.env`
require("dotenv-defaults").config();
console.log("Facade port", process.env.PORT);

// init module-alias
require("module-alias/register");

// init config
var config = require("@config");

// init logger
var logger = require("@logger").init(config.logger.logsPath + "all.log");

logger.info("Express Template v%s started%s. Path: %s", config.version, process.env.RUNNING_FOREVER ? " as daemon" : "", process.cwd());
logger.info("Environment: " + config.env);

let express, server;

// connect to MongoDB
require("@store/client").connect((err, client) => {
    if (err) {
        logger.error("MongoDB connection failed:");
        logger.error(err);
        return;
    }

    let mongoServer = client.s.options.servers[0];
    logger.info(`MongoDB connection opened: ${mongoServer.host}:${mongoServer.port}`);

    // init Express
    express = require("@server/express")(config);
    server = require("http").createServer(express);

    // init sessions
    var expressSession = require("express-session");
    var sessionStore;

    switch (config.session.store) {
        case "memory":
            // leave sessionStore undefined
            break;
        case "redis": {
            const redis = require("redis"),
                redisClient = redis.createClient(config.redis),
                RedisStore = require("connect-redis")(expressSession);
            
            sessionStore = new RedisStore({ client: redisClient });
            break;
        }
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
    require("@server/io").init(server, session);

    // init authentication module
    require("@lib/auth")(express);

    // define global response locals
    var devCacheHash = require("crypto").randomBytes(20).toString("hex").slice(0, 7);
    express.use(function (req, res, next) {
        if (req.user && req.user.config) {
            //req.user.config.foo = "bar";
        }

        res.locals = {
            config: config,
            lang: require("@server/langs").en,
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
            production: "production" === config.env,
            cacheHash: "production" === config.env ? config.commit : devCacheHash
        };
        next();
    });

    // init Express' routes
    require("@server/router")(express);

    // start HTTP-server
    server.listen(config.port);
    server.on("listening", function () {
        logger.info("Express Template Facade server listening on port " + config.port);
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

module.exports = express;
