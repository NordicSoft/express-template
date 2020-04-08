const passport = require("passport"),
    api = require("@api"),
    logger = require("@logger");

module.exports = function (express) {
    logger.info("Init Authentication");

    api.users.canRegister().then((canRegister) => {
        express.set("registration-enabled", canRegister);
    });

    // used to deserialize the user
    passport.deserializeUser(async function (sessionUser, done) {
        logger.debug("deserializeUser " + sessionUser.email);
        done(null, sessionUser);
    });

    express.use(passport.initialize());
    express.use(passport.session());
};
