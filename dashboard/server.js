// change process' current dir
process.chdir(__dirname);

// load environment variables from `.env`
require("dotenv-defaults").config();

const express = require("express"),
    path = require("path"),
    history = require("connect-history-api-fallback"),
    port = parseInt(process.env.DASHBOARD_PORT || process.env.PORT || 8083);

const app = express();

const distMiddleware = express.static(path.join(__dirname, "/dist"));
const publicMiddleware = express.static(
    path.resolve(__dirname, process.env.COMMON_STATIC_PATH)
);

// https://github.com/bripkens/connect-history-api-fallback/blob/master/examples/static-files-and-index-rewrite/README.md

app.use(process.env.BASE_URL, distMiddleware);
app.use(publicMiddleware);

app.use(
    history({
        disableDotRule: true,
        verbose: true,
        index: path.join(process.env.BASE_URL, "index.html")
    })
);

app.use(process.env.BASE_URL, distMiddleware);
app.use(publicMiddleware);

app.get("/", function(req, res) {
    res.render(path.join(__dirname + "/dist/index.html"));
});

app.listen(port, function() {
    console.log(`Dashboard server running on port ${port}`);
});

module.exports = app;
