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

module.exports = {
    partial: partial
};