const path = require("path"),
    publicPath = process.env.BASE_URL;

// https://cli.vuejs.org/config/#pages
const pages = {
    index: {
        entry: "src/main.js",
        template: "public/index.html",
        filename: "index.html",
        title: "Express Template Dashboard",
        chunks: [
            "chunk-vendors",
            "chunk-index-vendors",
            "chunk-common",
            "index"
        ]
    },
    auth: {
        entry: "src/auth/main.js",
        template: "public/index.html",
        filename: "auth.html",
        title: "Authenticate",
        chunks: ["chunk-vendors", "chunk-auth-vendors", "chunk-common", "auth"]
    }
};

module.exports = {
    publicPath,
    pages,

    transpileDependencies: ["vuetify"],
    
    lintOnSave: process.env.NODE_ENV !== 'production',

    devServer: {
        historyApiFallback: {
            verbose: true,
            disableDotRule: false,
            rewrites: [
                {
                    from: new RegExp(`^${publicPath}auth.*$`),
                    to: `${publicPath}auth.html`
                },
                {
                    from: new RegExp(`^${publicPath}error/?$`),
                    to: `${publicPath}error.html`
                },
                { from: /./, to: publicPath + "index.html" }
                //{ from: /./, to: context => { console.log(context); return context.parsedUrl.pathname; } }
            ]
        },
        contentBase: [
            path.resolve(__dirname, "dist"),
            path.resolve(__dirname, process.env.COMMON_STATIC_PATH)
        ],
        watchContentBase: false,
        port: process.env.PORT || 8083,
        progress: false
    },

    chainWebpack: config => {
        // https://github.com/vuejs/vue-cli/issues/2381#issuecomment-425038367
        const IS_VENDOR = /[\\/]node_modules[\\/]/;
        config.optimization.splitChunks({
            cacheGroups: {
                vendors: {
                    name: "chunk-vendors",
                    priority: -10,
                    chunks: "initial",
                    minChunks: 2,
                    test: IS_VENDOR,
                    enforce: true
                },
                ...Object.keys(pages).map(key => ({
                    name: `chunk-${key}-vendors`,
                    priority: -11,
                    chunks: chunk => chunk.name === key,
                    test: IS_VENDOR,
                    enforce: true
                })),
                common: {
                    name: "chunk-common",
                    priority: -20,
                    chunks: "initial",
                    minChunks: 2,
                    reuseExistingChunk: true,
                    enforce: true
                }
            }
        });
    }
};
