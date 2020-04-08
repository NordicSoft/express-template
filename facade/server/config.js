const packageJson = require(process.cwd() + "/package.json");

module.exports = {
    // environment
    env: process.env.NODE_ENV || "development",
    dev: process.env.NODE_ENV === undefined || process.env.NODE_ENV === "development",
    prod: process.env.NODE_ENV === "production",

    heroku: process.env._ && process.env._.indexOf("heroku"),

    // Express.js backend port
    port: parseInt(process.env.FACADE_PORT || process.env.PORT || 8082),
    
    // get version and commit from package.json
    version: packageJson.version,
    
    // current Git commit short hash
    commit: packageJson.commit,
    
    //path to static files (express.static)
    staticPath: process.env.STATIC_PATH,
    commonStaticPath: process.env.COMMON_STATIC_PATH,
    
    api: {
        baseUrl: process.env.API_BASE_URL,
        token: process.env.API_TOKEN,
    },

    auth: {
        signInUrl: process.env.AUTH_SIGNIN_URL,
        registerUrl: process.env.AUTH_REGISTER_URL
    },
    
    // not used? can be removed?
    logger: {
        logEnabled: process.env.LOG_ENABLED.toLowerCase() === "true",
        debugEnabled: process.env.DEBUG_ENABLED.toLowerCase() === "true",
        logsPath: process.env.LOG_FILE_PATH,
        consolePrefix: process.env.LOG_CONSOLE_PREFIX,
        consoleFgColor: process.env.LOG_CONSOLE_FG_COLOR,
        consoleBgColor: process.env.LOG_CONSOLE_BG_COLOR,
    },
    
    session: {
        store: process.env.SESSION_STORE,
        key: process.env.SESSION_KEY,
        secret: process.env.SESSION_SECRET,
    },
    
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
    },

    mongoDb: {
        url: process.env.MONGODB_URL
    },
    
    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        chatId: process.env.TELEGRAM_CHAT_ID
    },
    
    gallery: {
        newPhotosFirst: process.env.GALLERY_NEW_PHOTOS_FIRST === "true",
        defaultPhotoThumbnailSuffix: process.env.GALLERY_DEFAULT_PHOTO_THUMBNAIL_SUFFIX,
        defaultPhotoSuffix: process.env.GALLERY_DEFAULT_PHOTO_SUFFIX,
        lastPhotosCount: parseInt(process.env.GALLERY_LAST_PHOTOS_COUNT),
    }
};