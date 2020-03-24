// change process' current dir
process.chdir(__dirname);

// load environment variables from `.env`
require("dotenv-defaults").config();
console.log("Main port", process.env.PORT);
console.log("Main environment", process.env.NODE_ENV);

const express = require("express"),
    { createProxyMiddleware } = require("http-proxy-middleware"),
    port = process.env.PORT || 8080;

const app = express();

app.use("/api", createProxyMiddleware({ target: "http://localhost:8081", changeOrigin: true }));
app.use("/dashboard", createProxyMiddleware({ target: "http://localhost:8083", changeOrigin: true }));
app.use("/", createProxyMiddleware({ target: "http://localhost:8082", changeOrigin: true }));
app.listen(port, () => {
    console.log(`Main app listening on port ${port}`);
});