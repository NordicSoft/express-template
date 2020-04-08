// Thanks, Chris Sevilleja
// Init http://scotch.io/tutorials/javascript/easy-node-authentication-setup-and-local
// Facebook http://scotch.io/tutorials/javascript/easy-node-authentication-facebook
// Twitter http://scotch.io/tutorials/javascript/easy-node-authentication-twitter
// Google http://scotch.io/tutorials/javascript/easy-node-authentication-google
// Linking All Accounts Together http://scotch.io/tutorials/javascript/easy-node-authentication-linking-all-accounts-together

var security = require("./security"),
    md5 = security.md5,
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    //FacebookStrategy = require('passport-facebook').Strategy,
    //TwitterStrategy = require('passport-twitter').Strategy,
    GoogleStrategy = require("passport-google-oauth").OAuth2Strategy,
    //User = require('./../models/user'),
    config = require("@config"),
    logger = require("@logger"),
    store = require("@store"),
    strategies = {
        local: new LocalStrategy(
            {
                // by default, local strategy uses username and password, we will override with email
                usernameField: "username",
                passwordField: "password",
                passReqToCallback: true, // allows us to pass back the entire request to the callback
            },
            async function (req, username, password, done) {
                logger.info(username);
                logger.info(password);
                // asynchronous
                process.nextTick(async function () {
                    // find a user
                    let user;
                    try {
                        user = await store.users[
                            username.includes("@")
                                ? "getByEmail"
                                : "getByUsername"
                        ](username);
                        logger.dir(user);
                    } catch (err) {
                        logger.error(err);
                        return done(null, false, { message: "Unknown error" });
                    }

                    // if no user is found or password is wrong return error
                    if (!user) {
                        logger.info("User not found");
                        return done(null, false, {
                            message:
                                "User was not found or password is incorrect",
                        });
                    }

                    switch (config.passwordHashAlgorithm) {
                        case "md5":
                            if (md5(password) !== user.password) {
                                return done(null, false, {
                                    message:
                                        "User was not found or password is incorrect",
                                });
                            }
                            // all is well, return successful user
                            logger.info("Signin successful");
                            return done(null, user);
                        case "bcrypt":
                            security.bcryptCheck(
                                password,
                                user.password,
                                function (err, result) {
                                    if (err) {
                                        logger.error(
                                            "password check failed",
                                            err
                                        );
                                        return done(null, false, {
                                            message: "Unknown error",
                                        });
                                    }
                                    if (!result) {
                                        logger.info(
                                            !user
                                                ? "User not found"
                                                : "Password is incorrect"
                                        );
                                        return done(null, false, {
                                            message:
                                                "User was not found or password is incorrect",
                                        });
                                    }

                                    // all is well, return successful user
                                    logger.info("Signin successful");

                                    return done(null, user);
                                }
                            );
                            break;
                        default:
                            logger.error(
                                "Incorrect passwordHashAlgorithm specified in config.json"
                            );
                            break;
                    }
                });
            }
        ),
        google: new GoogleStrategy(config.auth.google,
            function(token, refreshToken, profile, done) {
                logger.info("GoogleStrategy");
                logger.dir(profile);
                // asynchronous
                process.nextTick(async function() {
                    // find a user
                    let user;
                    try {
                        user = await store.users.findOne({ "google.id" : profile.id });

                        // if not found by google.id
                        if (!user) {
                            // try to find by google email
                            user = await store.users.getByEmail(profile.emails[0].value);
                        }

                        logger.dir(user);
                    } catch (err) {
                        logger.error(err);
                        return done(null, false, { message: "Unknown error" });
                    }

                    // if a user is found, log in
                    if (user) {

                        try {
                        // update user info
                            user.name = user.name || profile.displayName;
                            user.email = user.email || profile.emails[0].value;
                            if (!user.photo && profile.photos && profile.photos.length) {
                                user.photo = profile.photos[0].value;
                            }
                            user.google = user.google || {};
                            user.google.id = profile.id;
                            user.google.token = token;
                            user.google.name = profile.displayName;
                            user.google.email = profile.emails[0].value;

                            await store.users.save(user);
                        } catch (err) {
                            // silent
                        }
                        logger.info("Google signin successful");
                        return done(null, user);
                    }

                    // if the user isn't in database - create a new user
                    user = {
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        photo: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined,
                        google: {
                            id: profile.id,
                            token,
                            name: profile.displayName,
                            email: profile.emails[0].value
                        }
                    };

                    let usersCount = await store.users.count();
                    if (usersCount === 0) {
                        user.roles = ["owner"];
                    }

                    try {
                        await store.users.save(user);
                        logger.info("New user registered with google");
                        return done(null, user);
                    } catch (err) {
                        logger.error(err);
                        return done(null, false, { message: "Unknown error" });
                    }
                });
            })
    };

module.exports = function (express) {
    logger.info("Init Authentication");

    if (config.registrationMode === "open") {
        express.set("registration-enabled", true);
    } else {
        store.users.count().then((count) => {
            express.set("registration-enabled", count === 0);
        });
    }

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        logger.debug("serializeUser " + user.email);
        var sessionUser = {
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            roles: user.roles,
        };
        done(null, sessionUser);
    });

    // used to deserialize the user
    passport.deserializeUser(async function (sessionUser, done) {
        logger.debug("deserializeUser " + sessionUser.email);
        done(null, sessionUser);
    });

    passport.use("local", strategies.local);
    passport.use(strategies.google);
    //passport.use(strategies.facebook);
    //passport.use(strategies.twitter);

    express.use(passport.initialize());
    express.use(passport.session());

    express.use(function (req, res, next) {
        req.signin = function (callback) {
            passport.authenticate("local", function (err, user, info) {
                if (user) {
                    req.login(user, function (err) {
                        if (err) {
                            callback(err);
                        }
                        callback(err, user, info);
                    });
                } else {
                    callback(err, user, info);
                }
            })(this);
        };

        req.signout = req.logout;

        next();
    });
};
