function partial(fn) {
    var slice = Array.prototype.slice,
        fixedArgs = slice.call(arguments, 1);
    return function() {
        var arg = 0,
            args = slice.call(fixedArgs); // clone
        for (var i = 0; i < args.length || arg < arguments.length; i++)
            if (args[i] === undefined) args[i] = arguments[arg++];
        return fn.apply(this, args);
    };
}

function addFilenameSuffix(filename, suffix) {
    const path = require("path"),
        extension = path.extname(filename);
    filename = filename.slice(0, -extension.length);
    return filename + "_" + suffix + extension;
}

module.exports = {
    partial,
    addFilenameSuffix
};