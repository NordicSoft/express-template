const path = require("path");
module.exports = {
    transpileDependencies: ["vuetify"],
    publicPath: process.env.BASE_URL,
    devServer: {
        contentBase: [
            path.resolve(__dirname, "dist"),
            path.resolve(__dirname, process.env.COMMON_STATIC_PATH)
        ],
        watchContentBase: false,
        port: process.env.PORT || 8083,
        progress: false
    }
};
