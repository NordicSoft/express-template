// change process' current dir
process.chdir(__dirname);

// load environment variables from `.env`
require("dotenv-defaults").config();

const path = require("path"),
    express = require("express"),
    { createProxyMiddleware: proxy } = require("http-proxy-middleware"),
    chalk = require("chalk"),
    logPrefix = chalk.keyword("azure").bgRed(' proxy '),
    port = process.env.PORT || 8080;

const app = express();

app.use(express.static(path.resolve(process.env.COMMON_STATIC_PATH)));

app.use("/api", proxy({
    target: process.env.API_URL, 
    logLevel: "error",
    changeOrigin: true, 
    pathRewrite: {"^/api" : ""},
}));

app.use("/dashboard", proxy({
    target: process.env.DASHBOARD_URL,
    logLevel: "error",
    changeOrigin: true 
}));

app.use("/", proxy({
    target: process.env.FACADE_URL,
    logLevel: "error",
    changeOrigin: true
}));

app.listen(port, () => {
    const clipboardy = require('clipboardy');
    clipboardy.writeSync("http://localhost:" + port);
    console.log(`${logPrefix} Development proxy running at ${chalk.blue("http://localhost:" + port)} (copied to clipboard)`);
});

// handle errors
process.on("uncaughtException", function (error) {
    console.error("uncaughtException");
    console.error(error);
});

process.on("unhandledRejection", function (reason, p) {
    console.error("unhandledRejection");
    console.error(reason);
    console.error(p);
});