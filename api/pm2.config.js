module.exports = {
    apps: [
        {
            name: "express-template-api",
            script: "npm",
            args: "start",
            error_file: "../logs/pm2-err.log",
            out_file: "../logs/pm2-out.log",
            combine_logs: true
        }
    ],
};
