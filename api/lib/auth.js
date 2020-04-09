const security = require("@lib/security"),
    config = require("@config"),
    logger = require("@logger"),
    store = require("@store"),
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    FacebookStrategy = require("passport-facebook").Strategy,
    GoogleStrategy = require("passport-google-oauth").OAuth2Strategy,
    strategies = {
        signin: new LocalStrategy(signinCallback),
        register: new LocalStrategy(
            { passReqToCallback: true },
            registerCallback
        ),
        google: new GoogleStrategy(
            config.auth.google,
            providerCallback("google")
        ),
        facebook: new FacebookStrategy(
            config.auth.facebook,
            providerCallback("facebook")
        ),
    };

function signinCallback(username, password, done) {
    logger.info("Signin", username);
    // asynchronous
    process.nextTick(async function () {
        // find a user
        let user;
        try {
            user = await store.users[
                username.includes("@") ? "getByEmail" : "getByUsername"
            ](username);
        } catch (err) {
            logger.error(err);
            return done(null, false, { message: "Unknown error" });
        }

        // if no user is found or password is wrong return error
        if (!user) {
            logger.info("User not found");
            return done(null, false, {
                message: "User was not found or password is incorrect",
            });
        }

        switch (config.auth.passwordHashAlgorithm) {
            case "md5":
                if (security.md5(password) !== user.password) {
                    return done(null, false, {
                        message: "User was not found or password is incorrect",
                    });
                }
                // all is well, return successful user
                logger.info("Signin successful");
                return done(null, user);
            case "bcrypt":
                security.bcryptCheck(password, user.password, function (
                    err,
                    result
                ) {
                    if (err) {
                        logger.error("password check failed", err);
                        return done(null, false, {
                            message: "Unknown error",
                        });
                    }
                    if (!result) {
                        logger.info(
                            !user ? "User not found" : "Password is incorrect"
                        );
                        return done(null, false, {
                            message:
                                "User was not found or password is incorrect",
                        });
                    }

                    // all is well, return successful user
                    logger.info("Signin successful");

                    return done(null, user);
                });
                break;
            default:
                logger.error("Incorrect passwordHashAlgorithm");
                break;
        }
    });
}

function registerCallback(req, username, password, done) {
    logger.info("Register", username);
    // asynchronous
    process.nextTick(async function () {
        if (req.isAuthenticated()) {
            return done(null, false, {
                message: "User is authenticated",
            });
        }

        if (!req.app.get("registration-enabled")) {
            return done(null, false, {
                message: "Registration disabled",
            });
        }

        let name = req.body.name,
            email = req.body.email,
            username = req.body.username,
            password = req.body.password,
            passwordConfirm = req.body.passwordConfirm;

        logger.info(`Register new user ${name} (${email})`);

        if (password !== passwordConfirm) {
            return done(null, false, {
                message: "Password and confirm password does not match",
            });
        }

        // check username
        if (await store.users.getByUsername(username)) {
            return done(null, false, {
                message: "This username is already taken",
            });
        }

        // check email
        if (await store.users.getByEmail(email)) {
            return done(null, false, {
                message: "This email is already taken",
            });
        }

        let user = {
            name,
            email,
            username,
        };

        let usersCount = await store.users.count();
        if (usersCount === 0) {
            user.roles = ["owner"];
        }

        switch (config.auth.passwordHashAlgorithm) {
            case "md5":
                user.password = security.md5(password);
                await store.users.insert(user);
                refreshRegistrationEnabled(req.app);
                return done(null, user);
            case "bcrypt":
                security.bcryptHash(password, async function (
                    err,
                    passwordHash
                ) {
                    user.password = passwordHash;
                    await store.users.insert(user);
                    refreshRegistrationEnabled(req.app);
                    return done(null, user);
                });
                break;
            default:
                logger.error("Incorrect passwordHashAlgorithm specified");
                return done(null, false, {
                    message: "Unknown error",
                });
        }
    });
}

async function refreshRegistrationEnabled(app) {
    let usersCount = await store.users.count();
    app.set(
        "registration-enabled",
        config.registrationMode === "open" || usersCount === 0
    );
}

function providerCallback(provider) {
    return function (token, refreshToken, profile, done) {
        logger.info("Strategy " + provider);
        $DEBUG$ && console.log(profile);
        // asynchronous
        process.nextTick(async function () {
            // find a user
            let user,
                name = profile.displayName,
                email =
                    profile.emails && profile.emails.length > 0
                        ? profile.emails[0].value
                        : undefined,
                photo =
                    profile.photos && profile.photos.length > 0
                        ? profile.photos[0].value
                        : undefined;

            if (!name && profile.name) {
                name = profile.name.givenName + " " + profile.name.familyName;
                name = name.trim();
            }

            try {
                user = await store.users.findOne({
                    [provider + ".id"]: profile.id,
                });

                // if not found by `provider`.id
                if (!user && email) {
                    // try to find by `provider` email
                    user = await store.users.getByEmail(email);
                }

                $DEBUG$ && console.log(user);
            } catch (err) {
                logger.error(err);
                return done(null, false, { message: "Unknown error" });
            }

            // if a user is found, log in
            if (user) {
                try {
                    // update user info
                    user.name = user.name || name;
                    user.email = user.email || email;
                    user.photo = user.photo || photo;
                    user[provider] = user[provider] || {};
                    user[provider].id = profile.id;
                    user[provider].token = token;
                    user[provider].name = name;
                    user[provider].email = email;
                    user[provider].photo = photo;

                    await store.users.save(user);
                } catch (err) {
                    // silent
                }
                logger.info(provider + " signin successful");
                return done(null, user);
            }

            // if the user isn't in database - create a new user
            user = {
                name,
                email: email,
                photo:
                    profile.photos && profile.photos.length > 0
                        ? profile.photos[0].value
                        : undefined,
                [provider]: {
                    id: profile.id,
                    token,
                    name: name,
                    email: email,
                },
            };

            let usersCount = await store.users.count();
            if (usersCount === 0) {
                user.roles = ["owner"];
            }

            try {
                await store.users.save(user);
                logger.info("New user registered with " + provider);
                return done(null, user);
            } catch (err) {
                logger.error(err);
                return done(null, false, { message: "Unknown error" });
            }
        });
    };
}

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

    passport.use("signin", strategies.signin);
    passport.use("register", strategies.register);
    passport.use(strategies.google);
    passport.use(strategies.facebook);

    express.use(passport.initialize());
    express.use(passport.session());
};
