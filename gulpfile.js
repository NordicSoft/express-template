/* eslint-disable no-console */

let gulp = require("gulp"),
    sass = require("gulp-sass"),
    uglify = require("gulp-uglify-es").default,
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    mqpacker = require("css-mqpacker"),
    cssnano = require("cssnano"),
    touch = require("gulp-touch-fd"),
    //concat = require("gulp-concat"),
    //file = require("gulp-file"),
    browserSync = require("browser-sync").create();

function browserSyncInit(callback) {
    browserSync.init({
        port: 3001,
        proxy: {
            target: "http://localhost:8080",
            ws: true
        }
    });

    callback();
}

function cssBundle() {
    let postcssPlugins = [
        autoprefixer({ browsers: ["last 3 version"] }),
        mqpacker(),
    ];

    return gulp.src(["assets/scss/dashboard.scss", "assets/scss/welcome.scss"])
        .pipe(sass().on("error", sass.logError))
        .pipe(postcss(postcssPlugins))
        .pipe(gulp.dest("www/css"))
        .pipe(touch());
}

function cssMinify() {
    return gulp.src(["www/css/welcome.css", "www/css/dashboard.css"])
        .pipe(postcss([
            cssnano()
        ]))
        .pipe(gulp.dest("www/css"))
        .pipe(touch());
}

async function rollup(input, output, watch, callback) {
    let rollup = require("rollup"),
        babel = require("rollup-plugin-babel"),
        alias = require("rollup-plugin-alias"),
        replace = require("rollup-plugin-replace"),
        commonjs = require("rollup-plugin-commonjs"),
        noderesolve = require("rollup-plugin-node-resolve"),
        json = require("rollup-plugin-json"),
        sass = require("rollup-plugin-sass"),
        vue = require("rollup-plugin-vue"),
        css = require("rollup-plugin-css-only");

    let inputOptions = {
        input: input,
        plugins: [
            json(),
            babel({
                "presets": [
                    [
                        "@babel/env",
                        {
                            "modules": false,
                            "targets": {
                                "chrome": "58",
                                "ie": "11",
                                //"node": "current"
                            }
                        }
                    ]
                ],
                "exclude": ["node_modules/**", "assets/js/vendor/**"]
            }),
            replace({
                "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
            }),
            alias({
                "vue": require.resolve("vue/dist/vue.esm.js"),
                "axios": require.resolve("axios/dist/axios"),
                "babel-polyfill": require.resolve("@babel/polyfill/lib"),
                "core": "assets/js/core.js",
                "options": "assets/js/options.js"
            }),
            commonjs(),
            noderesolve({ extensions: [".js", ".json", ".vue"] }),
            sass(),
            css({ output: "assets/scss/vue-components.scss" }),
            vue({ css: false })
        ]
    };

    let outputOptions = {
        file: output,
        format: "iife"
    };

    if (!watch) {
        let bundle = await rollup.rollup(inputOptions);
        await bundle.write(outputOptions);
        typeof callback === "function" && callback();
        return;
    }

    // rollup.watch(...) does rollup.rollup and bundle.write()
    var watcher = rollup.watch({
        ...inputOptions,
        output: outputOptions,
        watch: {
            include: "assets/js/**",
            exclude: "node_modules/**"
        }
    });

    watcher.on("event", e => {
        switch (e.code) {
            case "BUNDLE_START":
                console.log(`Rollup ${e.input} started`);
                break;
            case "BUNDLE_END":
                console.log(`Rollup ${e.input} finished in ${e.duration} ms`);
                break;
            case "END":
                browserSync.reload();
                typeof callback === "function" && callback();
                break;
            case "ERROR":
            case "FATAL":
                console.log(`ERROR while rollup ${e.input}`);
                console.log(e);
                typeof callback === "function" && callback();
                break;
        }
    });
}

function jsWelcomeRollup(watch) {
    return function jsWelcomeRollup(callback) {
        rollup("assets/js/welcome/index.js", "www/js/welcome.js", watch, callback);
    };
}

function jsWelcomeMinify() {
    return gulp.src("www/js/welcome.js")
        .pipe(uglify())
        .pipe(gulp.dest("www/js"))
        .pipe(touch());
}

function jsDashboardRollup(watch) {
    return function jsDashboardRollup(callback) {
        rollup("assets/js/dashboard/index.js", "www/js/dashboard.js", watch, callback);
    };
}

function jsDashboardMinify() {
    return gulp.src("www/js/dashboard.js")
        .pipe(uglify())
        .pipe(gulp.dest("www/js"))
        .pipe(touch());
}

function jsServiceWorker() {

    var replace = require("gulp-replace"),
        shush = require("shush"),
        argv = require("minimist")(process.argv.slice(2)),
        version = shush(process.cwd() + "/package.json").version,
        hash = require("crypto").randomBytes(20).toString("hex").slice(0, 10),
        commit = argv.commit || hash;

    return gulp.src("assets/js/service-worker.js")
        .pipe(replace("${version}", version))
        .pipe(replace("${commit}", commit))
        .pipe(gulp.dest("www"))
        .pipe(touch());
}

function watch(callback) {
    gulp.watch(["assets/scss/**/*.scss"], cssBundle);
    gulp.watch(["assets/js/service-worker.js"], jsServiceWorker);

    // NOTE: native rollup.watch() is used to watch on welcome & dashboard JS file changes
    
    callback();
}

function deploy() {
    var replace = require("gulp-replace"),
        argv = require("minimist")(process.argv.slice(2)),
        dest = argv.dest || "dist",
        commit = argv.commit || "---",
        backup = argv.backup || "---";

    // eslint-disable-next-line no-console
    console.log(`Deploying commit '${commit}' into folder: ${dest}`);
    var files = [
        "app/**/*",
        "www/**/*",
        "views/**/*",
        "*.html",
        "*.json",
        "*.js",
        "*.md",
        ".foreverignore",
        "!config.json",
        "!package.json", // will be added separately
        "!package-lock.json",
        "!gulpfile.js"
    ];

    return gulp.src("package.json")
        .pipe(replace("${commit}", commit))
        .pipe(replace("${backup}", backup))
        .pipe(gulp.src(files, { base: "." }))
        .pipe(gulp.dest(dest));
}

exports.default = gulp.series(
    gulp.parallel(jsWelcomeRollup(true), jsDashboardRollup(true), jsServiceWorker, watch),
    cssBundle, // cssBundle after jsDashboardRollup because of extracted Vue Single File Component styles (vue-components.scss)
    browserSyncInit
);


exports.build = gulp.series(
    gulp.parallel(cssBundle, jsWelcomeRollup(false), jsDashboardRollup(false)),
    gulp.parallel(cssMinify, jsWelcomeMinify, jsDashboardMinify)
);

exports.deploy = gulp.series(jsServiceWorker, deploy);
