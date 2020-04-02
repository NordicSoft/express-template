// change process' current dir
const path = require("path");
process.chdir(path.resolve(__dirname, ".."));

// load environment variables from `.env`
require("dotenv-defaults").config();

// init module-alias
require("module-alias/register");

// init config
const config = require("@config");

// init logger
const chalk = require("chalk"),
    logPrefix = chalk
        .keyword(config.logger.consoleFgColor)
        .bgKeyword(config.logger.consoleBgColor)(` ${config.logger.consolePrefix} `),
    logger = require("@logger").init(path.resolve(config.logger.logsPath), logPrefix);

logger.info("Express Template Facade v%s started%s. Path: %s", config.version, process.env.RUNNING_FOREVER ? " as daemon" : "", process.cwd());
logger.info("Environment: " + config.env);

let express, server;

// init Express
express = require("@server/express")(config);
server = require("http").createServer(express);

// log every request to the console and forever's log
const morgan = require("morgan");
morgan.token("user", function (req) {
    return req.user ? req.user._id.toString() : "?";
});
morgan.format("production", ":date[iso] :method :url :status - :res[content-length]bytes :response-time[3]ms ip=:remote-addr user=:user referrer=:referrer agent=:user-agent");
morgan.format("dev", `${logPrefix} ${chalk.bold(":method")} :url :status - :res[content-length]bytes :response-time[3]ms user=:user`);
express.use(morgan(config.prod ? "production" : "dev"));

// init sessions
var expressSession = require("express-session");
var sessionStore;

switch (config.session.store) {
    case "memory":
        // leave sessionStore undefined
        logger.info("Use memory session storage");
        break;
    case "redis": {
        logger.info(`Use Redis session storage: ${config.redis.host}:${config.redis.port}`);
        const redis = require("redis"),
            redisClient = redis.createClient(config.redis),
            RedisStore = require("connect-redis")(expressSession);
            
        sessionStore = new RedisStore({ client: redisClient });
        break;
    }
    case "mongo": {
        logger.info("Use Mongo session storage");
        const MongoStore = require("connect-mongo")(expressSession);
        
        sessionStore = new MongoStore(config.mongoDb);
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
        registrationEnabled: req.app.get("registration-enabled"),
        production: config.prod,
        development: config.dev,
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
