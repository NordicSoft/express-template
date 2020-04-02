const path = require("path"),
    packageJson = require(process.cwd() + "/package.json");

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

    //password hashing algorithm (md5 or bcrypt; for bcrypt install https://www.npmjs.com/package/bcrypt)
    passwordHashAlgorithm: process.env.PASSWORD_HASH_ALGORITHM,
    
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
    
    fileBrowser: {
        uploadPath: path.resolve(process.env.FILEBROWSER_UPLOAD_PATH),
        rootPath: path.resolve(process.env.FILEBROWSER_ROOT_PATH)
    },
    
    gallery: {
        // currently only `local` gallery storage is supported
        storage: process.env.GALLERY_STORAGE,
        uploadPath: path.resolve(process.env.GALLERY_UPLOAD_PATH),
        rootPath: path.resolve(process.env.GALLERY_ROOT_PATH),
        photosPath: process.env.GALLERY_PHOTOS_PATH,
        photoSetsPath: process.env.GALLERY_PHOTOSETS_PATH,
        trashPath: process.env.GALLERY_TRASH_PATH,
        // image processing module (sharp or jimp, must be installed)
        imageProcessingModule: process.env.GALLERY_IMAGE_PROCESSING_MODULE,
        jpgQuality: parseInt(process.env.GALLERY_JPG_QUALITY),
        // comma-separated image sizes: "<suffix>:<width>x<height>"
        imageSizes: process.env.GALLERY_IMAGE_SIZES,
        dashboardThumbnailSuffix: process.env.GALLERY_DASHBOARD_THUMBNAIL_SUFFIX,
        newPhotosFirst: process.env.GALLERY_NEW_PHOTOS_FIRST === "true"
    }
};