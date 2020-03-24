module.exports = function (hbs) {
    // https://stackoverflow.com/a/12397602/2550004
    hbs.registerHelper("breaklines", function(text) {
        text = hbs.Utils.escapeExpression(text);
        text = text.replace(/(\r\n|\n|\r)/gm, "<br>");
        return new hbs.SafeString(text);
    });

    // https://stackoverflow.com/a/31632215/2550004
    hbs.registerHelper({
        eq: function (v1, v2) {
            return v1 === v2;
        },
        ne: function (v1, v2) {
            return v1 !== v2;
        },
        lt: function (v1, v2) {
            return v1 < v2;
        },
        gt: function (v1, v2) {
            return v1 > v2;
        },
        lte: function (v1, v2) {
            return v1 <= v2;
        },
        gte: function (v1, v2) {
            return v1 >= v2;
        },
        and: function () {
            return Array.prototype.slice.call(arguments).every(Boolean);
        },
        or: function () {
            return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
        }
    });
};