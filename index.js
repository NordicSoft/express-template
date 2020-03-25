// change process' current dir
process.chdir(__dirname);

// load environment variables from `.env`
require("dotenv-defaults").config();

const express = require("express"),
    { createProxyMiddleware: proxy } = require("http-proxy-middleware"),
    chalk = require("chalk"),
    logPrefix = chalk.keyword("azure").bgRed(' proxy '),
    port = process.env.PORT || 8080;

const app = express();

app.use("/api", proxy({ target: "http://localhost:8081", logLevel: "error", changeOrigin: true, pathRewrite: {"^/api" : ""} }));
app.use("/dashboard", proxy({ target: "http://localhost:8083", logLevel: "error", changeOrigin: true }));
app.use("/", proxy({ target: "http://localhost:8082", logLevel: "error", changeOrigin: true }));
app.listen(port, () => {
    console.log(`${logPrefix} Development proxy running at ${chalk.blue("http://localhost:" + port)}`);
});
