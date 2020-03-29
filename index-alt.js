// change process' current dir
process.chdir(__dirname);

// load environment variables from `.env`
require("dotenv-defaults").config();

const http = require("http"),
    httpProxy = require("http-proxy"),
    chalk = require("chalk"),
    logPrefix = chalk.keyword("azure").bgRed(' proxy '),
    port = process.env.PORT || 8080;

var proxy = httpProxy.createProxy();

http.createServer(function(req, res) {
    if (req.url.startsWith("/api")) {
        req.url = req.url.slice(4);
        return proxy.web(req, res, { target: process.env.API_URL, changeOrigin: true });
    } else if (req.url.startsWith("/dashboard")) {
        return proxy.web(req, res, { target: process.env.DASHBOARD_URL, changeOrigin: true });
    }
    return proxy.web(req, res, { target: process.env.FACADE_URL, changeOrigin: true });
}).listen(port, () => {
    console.log(`${logPrefix} Development proxy running at ${chalk.blue("http://localhost:" + port)}`);
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