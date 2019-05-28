var shush = require("shush");

var config = shush(process.cwd() + "/config.json");

if (config.useProcessEnv) {
    // override defaults with settings from process.env
    config.env = (process.env[config.processEnvVar] || config.env).trim();
    config.port = Number(process.env[config.processPortVar] || config.port);
}

// get version and commit from package.json
var packageJson = shush(process.cwd() + "/package.json");
config.version = packageJson.version;
config.commit = packageJson.commit;

module.exports = config;