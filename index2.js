// change process' current dir
process.chdir(__dirname);

// load environment variables from `.env`
require("dotenv-defaults").config();
console.log("Main port", process.env.PORT);

const http = require("http"),
    httpProxy = require("http-proxy"),
    HttpProxyRules = require("http-proxy-rules"),
    port = process.env.PORT || 8080;

// Set up proxy rules instance
var proxyRules = new HttpProxyRules({
    rules: {
        ".*/api": "http://localhost:8081", // API
        ".*/dashboard": "http://localhost:8083", // dashboard
    },
    default: "http://localhost:8082" // facade
});

// Create reverse proxy instance
var proxy = httpProxy.createProxy();

// Create http server that leverages reverse proxy instance
// and proxy rules to proxy requests to different targets
http.createServer(function(req, res) {
    // a match method is exposed on the proxy rules instance
    // to test a request to see if it matches against one of the specified rules
    var target = proxyRules.match(req);
    if (target) {
        return proxy.web(req, res, { target });
    }

    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("The request url and path did not match any of the listed rules!");
}).listen(port, () => {
    console.log(`Main app listening on port ${port}`);
});
