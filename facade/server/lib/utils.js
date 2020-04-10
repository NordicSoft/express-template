module.exports.addFilenameSuffix = (filename, suffix) => {
    const path = require("path"),
        extension = path.extname(filename);
    filename = filename.slice(0, -extension.length);
    return filename + "_" + suffix + extension;
};
