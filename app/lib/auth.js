// Thanks, Chris Sevilleja 
// Init http://scotch.io/tutorials/javascript/easy-node-authentication-setup-and-local 
// Facebook http://scotch.io/tutorials/javascript/easy-node-authentication-facebook
// Twitter http://scotch.io/tutorials/javascript/easy-node-authentication-twitter
// Google http://scotch.io/tutorials/javascript/easy-node-authentication-google
// Linking All Accounts Together http://scotch.io/tutorials/javascript/easy-node-authentication-linking-all-accounts-together

var security = require("./security"),
    md5 = security.md5,
    clone = require("clone"),
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    //FacebookStrategy = require('passport-facebook').Strategy,
    //TwitterStrategy = require('passport-twitter').Strategy,
    //GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    //User = require('./../models/user'),
    config = require("./config"),
    logger = require("./logger"),
    store = require("./../store"),
    strategies = {
        local: new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
            async function (req, username, password, done) {
                logger.info(username);
                logger.info(password);
                // asynchronous
                process.nextTick(async function () {
                    // find a user
                    let user;
                    try {
                        user = await store.getUserByEmail(username);
                        logger.dir(user);
                    } catch (err) {
                        logger.error(err);
                        return done(null, false, "Unknown error");
                    }

                    // if no user is found or password is wrong return error
                    if (!user) {
                        logger.info("User not found");
                        return done(null, false, "User was not found or password is incorrect");
                    }

                    switch (config.passwordHashAlgorithm) {
                        case "md5":
                            if (md5(password) !== user.password) {
                                return done(null, false, "User was not found or password is incorrect");
                            }
                            // all is well, return successful user
                            logger.info("Signin successful");
                            return done(null, user);
                        case "bcrypt":
                            security.bcryptCheck(password, user.password, function (err, result) {
                                if (err) {
                                    logger.error("password check failed", err);
                                    return done(null, false, "Unknown error");
                                }
                                if (!result) {
                                    logger.info(!user ? "User not found" : "Password is incorrect");
                                    return done(null, false, "User was not found or password is incorrect");
                                }

                                // all is well, return successful user
                                logger.info("Signin successful");

                                return done(null, user);
                            });
                            break;
                        default:
                            logger.error("Incorrect passwordHashAlgorithm specified in config.json");
                            break;
                    }
                });
            }),
        /*facebook: new FacebookStrategy({
                // pull in our app id and secret from our auth.js file
                clientID: configAuth.facebookAuth.clientID,
                clientSecret: configAuth.facebookAuth.clientSecret,
                callbackURL: configAuth.facebookAuth.callbackURL
            },
            // facebook will send back the token and profile
            function(token, refreshToken, profile, done) {

                // asynchronous
                process.nextTick(function() {

                    // find the user in the database based on their facebook id
                    store.getUser({ 'facebook.id': profile.id }, function(err, user) {

                        // if there is an error, stop everything and return that
                        // ie an error connecting to the database
                        if (err)
                            return done(err);

                        // if the user is found, then log them in
                        if (user) {
                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user found with that facebook id, create them
                            var newUser = new User();

                            // set all of the facebook information in our user model
                            newUser.facebook.id = profile.id; // set the users facebook id	                
                            newUser.facebook.token = token; // we will save the token that facebook provides to the user	                
                            newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                            newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                            // save our user to the database
                            newUser.save(function(err) {
                                if (err)
                                    throw err;

                                // if successful, return the new user
                                return done(null, newUser);
                            });
                        }

                    });
                });

            }),
        twitter: new TwitterStrategy({
                consumerKey: configAuth.twitterAuth.consumerKey,
                consumerSecret: configAuth.twitterAuth.consumerSecret,
                callbackURL: configAuth.twitterAuth.callbackURL
            },
            function(token, tokenSecret, profile, done) {

                // make the code asynchronous
                // store.getUser won't fire until we have all our data back from Twitter
                process.nextTick(function() {

                    store.getUser({ 'twitter.id': profile.id }, function(err, user) {

                        // if there is an error, stop everything and return that
                        // ie an error connecting to the database
                        if (err)
                            return done(err);

                        // if the user is found then log them in
                        if (user) {
                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user, create them
                            var newUser = new User();

                            // set all of the user data that we need
                            newUser.twitter.id = profile.id;
                            newUser.twitter.token = token;
                            newUser.twitter.username = profile.username;
                            newUser.twitter.displayName = profile.displayName;

                            // save our user into the database
                            newUser.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }
                    });

                });

            }),
        google: new GoogleStrategy({
                clientID: configAuth.googleAuth.clientID,
                clientSecret: configAuth.googleAuth.clientSecret,
                callbackURL: configAuth.googleAuth.callbackURL,
            },
            function(token, refreshToken, profile, done) {

                // make the code asynchronous
                // store.getUser won't fire until we have all our data back from Google
                process.nextTick(function() {

                    // try to find the user based on their google id
                    store.getUser({ 'google.id': profile.id }, function(err, user) {
                        if (err)
                            return done(err);

                        if (user) {

                            // if a user is found, log them in
                            return done(null, user);
                        } else {
                            // if the user isnt in our database, create a new user
                            var newUser = new User();

                            // set all of the relevant information
                            newUser.google.id = profile.id;
                            newUser.google.token = token;
                            newUser.google.name = profile.displayName;
                            newUser.google.email = profile.emails[0].value; // pull the first email

                            // save the user
                            newUser.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }
                    });
                });

            })*/
    };

module.exports = function (express) {
    logger.info("Init Authentication");

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        logger.debug("serializeUser " + user.email);
        var sessionUser = { _id: user._id, name: user.name, email: user.email, roles: user.roles };
        done(null, sessionUser);
    });

    // used to deserialize the user
    passport.deserializeUser(async function (sessionUser, done) {
        logger.debug("deserializeUser " + sessionUser.email);
        /*
        let user = await store.getUserById(id);

        if (!user) {
            return done(null, false);
        }*/

        done(null, sessionUser);
    });

    passport.use("local", strategies.local);
    //passport.use(strategies.facebook);
    //passport.use(strategies.twitter);
    //passport.use(strategies.google);

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