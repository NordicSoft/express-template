var winston = require("winston"),
    format = require("logform").format,
    defaultLogLevel = process.env.NODE_ENV === "production" ? "info" : "debug";

module.exports.init = (filename, prefix, level) => {

    var formatFile = format.combine(
        format.splat(),
        format.timestamp(),
        format.printf(log => {
            return `${log.timestamp} ${log.level}: ${log.message}`;
        })
    );
    
    var formatConsole = format.combine(
        format.splat(),
        format.colorize(),
        format.printf(log => {
            return `${prefix ? prefix + " " : ""}${log.level}: ${log.message}`;
        })
    );

    var logger = winston.createLogger({
        ///format: format,
        transports: [
            new winston.transports.Console({
                name: "console",
                level: level || defaultLogLevel,
                format: process.env.RUNNING_FOREVER ? formatFile : formatConsole
            }),
            new winston.transports.File({
                name: "file",
                level: level || defaultLogLevel,
                filename: filename || "all.log",
                format: formatFile
            })
        ]
    });

    module.exports = {
        setLevel: level => {
            logger.transports.find(transport => { return transport.name === "console"; }).level = level;
            logger.transports.find(transport => { return transport.name === "file"; }).level = level;
        },

        debug: logger.log.bind(logger, "debug"),
        dir: logger.log.bind(logger, "debug", "%j"),
        info: logger.log.bind(logger, "info"),
        warn: logger.log.bind(logger, "warn"),
        error:  function (error) {
            if (typeof error == "string") {
                return logger.error(error);
            }
            return logger.error("%O", error);
        } 
    };

    return module.exports;
};
