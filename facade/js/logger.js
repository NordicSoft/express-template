function createLogger(level) {
    const logLevels = ["debug", "log", "info", "warn", "error"];
    if (logLevels.indexOf(level) >= logLevels.indexOf(process.env.LOG_LEVEL)) {
        if (process.env.NODE_ENV === "production") {
            window.log = window.log || [];
            return function () {
                let data = [...arguments].map(x => {
                    if (typeof x === "object") {
                        if (x instanceof Error) {
                            return x.toString();
                        }
                        return JSON.stringify(x);
                    }
                    return x;
                });
                window.log.unshift(`[${level.toUpperCase()}] ${data.join(" ")}`);
            };
        }
        return function () {
            console[level].apply(console, arguments);
        };
    }
    return () => {
        /* suppress */
    };
}

const debug = createLogger("debug"),
    log = createLogger("log"),
    info = createLogger("info"),
    warn = createLogger("warn"),
    error = createLogger("error"),
    logger = log;

logger.debug = debug;
logger.log = log;
logger.info = info;
logger.warn = warn;
logger.error = error;

export { logger, debug, log, info, warn, error };

export default logger;
