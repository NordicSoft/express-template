module.exports = {
    apps: [
        {
            name: "express-template-api",
            script: "node",
            args: "api",
            error_file: "./logs/pm2-err.log",
            out_file: "./logs/pm2-out.log",
            combine_logs: true
        },
        {
            name: "express-template-facade",
            script: "node",
            args: "facade",
            error_file: "./logs/pm2-err.log",
            out_file: "./logs/pm2-out.log",
            combine_logs: true
        },
    ],
};
