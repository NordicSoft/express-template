// load environment variables from `.env`
require("dotenv-defaults").config();

let gulp = require("gulp"),
    log = require("fancy-log"),
    sass = require("gulp-sass"),
    uglify = require("gulp-uglify-es").default,
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    touch = require("gulp-touch-fd"),
    browserSync = require("browser-sync").create();

/**
 * Browsersync setup - https://www.npmjs.com/package/browser-sync
*/
function browserSyncInit(callback) {
    browserSync.init({
        port: 3001,
        logPrefix: "facade browsersync"
        /*proxy: {
            target: "http://localhost:" + (process.env.PORT || 8082),
            ws: true
        }*/
    });

    callback();
}

/**
 * Copies Font Awesome fonts from node_modules to public/fonts
*/
function fontAwesome() {
    return gulp.src(["node_modules/@fortawesome/fontawesome-free/webfonts/**/*"])
        .pipe(gulp.dest("public/fonts/fontawesome"));
}

/**
 * Compiles SCSS, applies required PostCSS plugins:
 * Autoprefixer - https://www.npmjs.com/package/autoprefixer
 * 
 * output: public/css/facade.css
*/
function cssBundle() {
    let postcssPlugins = [
        autoprefixer()
    ];

    return gulp.src(["scss/facade.scss"])
        .pipe(sass().on("error", sass.logError))
        .pipe(postcss(postcssPlugins))
        .pipe(gulp.dest("public/css"))
        .pipe(touch())
        .pipe(browserSync.stream());
}

/**
 * Minifies CSS with cssnano - https://cssnano.co/
 * output: minified public/css/facade.css
 */
function cssMinify() {
    return gulp.src(["public/css/facade.css"])
        .pipe(postcss([
            cssnano()
        ]))
        .pipe(gulp.dest("public/css"))
        .pipe(touch());
}

/**
 * Use Rollup.js to bundle JavaScript - https://rollupjs.org
 * 
 * Used plugins:
 * Babel - https://www.npmjs.com/package/rollup-plugin-babel
 * Alias - https://www.npmjs.com/package/@rollup/plugin-alias
 * Replace - https://www.npmjs.com/package/@rollup/plugin-replace
 * CommonJS - https://www.npmjs.com/package/@rollup/plugin-commonjs
 * Node Resolve - https://www.npmjs.com/package/@rollup/plugin-node-resolve
 * JSON - https://www.npmjs.com/package/@rollup/plugin-json
 * SASS - https://www.npmjs.com/package/rollup-plugin-sass
 * Vue.js - https://www.npmjs.com/package/rollup-plugin-vue
 * CSS Only - https://www.npmjs.com/package/rollup-plugin-css-only
 * 
 * @param  {string} input - input (entry) file path
 * @param  {string} output - output file path
 * @param  {bool} watch - use Rollup's build-in watch function to detect file changes
 * @param  {function} callback
*/
async function rollup(input, output, watch, callback) {
    let rollup = require("rollup"),
        babel = require("rollup-plugin-babel"),
        alias = require("@rollup/plugin-alias"),
        replace = require("@rollup/plugin-replace"),
        commonjs = require("@rollup/plugin-commonjs"),
        noderesolve = require("@rollup/plugin-node-resolve"),
        json = require("@rollup/plugin-json"),
        sass = require("rollup-plugin-sass");

    let inputOptions = {
        input: input,
        plugins: [
            json(),
            babel({
                "presets": [
                    [
                        "@babel/env", { "modules": false, "targets": { "chrome": "58", "ie": "11" } }
                    ]
                ],
                "exclude": ["node_modules/**", "js/vendor/**"]
            }),
            replace({
                "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
                "process.env.LOG_LEVEL": JSON.stringify(process.env.LOG_LEVEL),
                "process.env.GALLERY_PHOTOSET_COVER_SIZES": JSON.stringify(process.env.GALLERY_PHOTOSET_COVER_SIZES),
                "process.env.GALLERY_IMAGE_SIZES": JSON.stringify(process.env.GALLERY_IMAGE_SIZES)
            }),
            alias({
                entries: {
                    "axios": require.resolve("axios/dist/axios"),
                    "babel-polyfill": require.resolve("@babel/polyfill/lib"),
                    "logger": "js/logger.js",
                    "loader": "js/loader.js"
                }
            }),
            noderesolve({ extensions: [".js", ".json", ".vue"] }),
            commonjs(),
            sass()
        ]
    };

    let outputOptions = {
        file: output,
        format: "iife"
    };

    // if files watching is not required then rollup, write and exit
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
            include: "js/**",
            exclude: "node_modules/**"
        }
    });

    watcher.on("event", e => {
        switch (e.code) {
            case "BUNDLE_START":
                log(`Rollup ${e.input} started`);
                break;
            case "BUNDLE_END":
                log(`Rollup ${e.input} finished in ${e.duration} ms`);
                break;
            case "END":
                browserSync.reload();
                typeof callback === "function" && callback();
                break;
            case "ERROR":
            case "FATAL":
                log(`ERROR while rollup ${e.input}`);
                log(e);
                typeof callback === "function" && callback();
                break;
        }
    });
}

// rollups JS
function jsRollup(watch) {
    return function jsRollup(callback) {
        rollup("js/index.js", "public/js/facade.js", watch, callback);
    };
}

// minifies JS
function jsMinify() {
    return gulp.src("public/js/facade.js")
        .pipe(uglify())
        .pipe(gulp.dest("public/js"))
        .pipe(touch());
}

// prepares service-worker.js
function jsServiceWorker() {

    var replace = require("gulp-replace"),
        argv = require("minimist")(process.argv.slice(2)),
        version = require(process.cwd() + "/package.json").version,
        hash = require("crypto").randomBytes(20).toString("hex").slice(0, 10),
        commit = argv.commit || hash;

    return gulp.src("js/service-worker.js")
        .pipe(replace("${version}", version))
        .pipe(replace("${commit}", commit))
        .pipe(gulp.dest("public"))
        .pipe(touch());
}


function watch(callback) {
    gulp.watch(["scss/**/*.scss"], cssBundle);
    gulp.watch(["js/service-worker.js"], jsServiceWorker);

    // NOTE: native rollup.watch() is used to watch JS file changes

    callback();
}


function deploy() {
    var replace = require("gulp-replace"),
        argv = require("minimist")(process.argv.slice(2)),
        dest = argv.dest || "dist",
        commit = argv.commit || "---",
        backup = argv.backup || "---";

    log(`Deploying commit '${commit}' into folder: ${dest}`);
    var files = [
        "app/**/*",
        "public/**/*",
        "views/**/*",
        "*.html",
        "*.json",
        "*.js",
        "*.md",
        ".foreverignore",
        // ignore the following files:
        "!public/files/**/*",
        "!config.json",
        "!package.json", // will be added separately
        "!package-lock.json",
        "!gulpfile.js"
    ];

    return gulp.src("package.json")             // add package.json
        .pipe(replace("${commit}", commit))     // set actual Git commit short SHA-1 hash in package.json, if specified
        .pipe(replace("${backup}", backup))     // set path to backup archive in package.json, if specified
        .pipe(gulp.src(files, { base: "." }))   // add all other files to be deployed
        .pipe(gulp.dest(dest));
}


// default task is for development purposes
exports.default = gulp.series(
    gulp.parallel(cssBundle, jsRollup(true), jsServiceWorker, fontAwesome, watch),
    browserSyncInit
);


// concatenates and minifies all styles and scripts
exports.build = gulp.series(
    gulp.parallel(cssBundle, fontAwesome, jsRollup(false)),
    gulp.parallel(cssMinify, jsMinify)
);


/*
Deploys required files. Accepts command line arguments:
    --dest       deploy path, 'dist' folder by default
    --commit     Git commit short SHA-1 hash, '---' by default
    --backup     path to backup archive, '---' by default
*/
exports.deploy = gulp.series(jsServiceWorker, deploy);
