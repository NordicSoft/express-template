const express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    logger = require("@logger"),
    config = require("@config"),
    store = require("@store"),
    { xhrOnly } = require("@lib/filters");

function signin(req, res) {
    req.signin(function (err, user, info) {
        if (user) {
            return res.json({});
        }
        return res.status(400).json(info);
    });
}

async function refreshRegistrationEnabled(app) {
    let registrationEnabled =
        config.registrationMode === "open" || (await store.users.count()) === 0;
    app.set("registration-enabled", registrationEnabled);
}

router.get("/", xhrOnly, function (req, res) {
    return res.json({
        isAuthenticated: req.isAuthenticated(),
        registrationEnabled: req.app.get("registration-enabled"),
    });
});

router.get("/check-email/:email", xhrOnly, async function (req, res) {
    var email = req.params.email,
        user = await store.users.getByEmail(email);
    return res.json(!user);
});

router.get("/check-username/:username", xhrOnly, async function (req, res) {
    var username = req.params.username,
        user = await store.users.getByUsername(username);
    return res.json(!user);
});

router.post("/signin", xhrOnly, signin);

router.post("/register", xhrOnly, async function (req, res) {
    if (req.isAuthenticated()) {
        return res.status(400).json({ message: "User is authenticated" });
    }

    if (!req.app.get("registration-enabled")) {
        return res.sendStatus(404);
    }

    let name = req.body.name,
        email = req.body.email,
        username = req.body.username,
        password = req.body.password,
        passwordConfirm = req.body.passwordConfirm;

    logger.info(`Register new user ${name} (${email})`);

    if (password !== passwordConfirm) {
        return res.status(400).json({
            message: "Password and confirm password does not match",
        });
    }

    // check username
    if (await store.users.getByUsername(username)) {
        return res
            .status(400)
            .json({ message: "This username is already taken" });
    }

    // check email
    if (await store.users.getByEmail(email)) {
        return res.status(400).json({ message: "This email is already taken" });
    }

    let security = require("@lib/security");
    let user = {
        name,
        email,
        username,
    };

    let usersCount = await store.users.count();
    if (usersCount === 0) {
        user.roles = ["owner"];
    }

    switch (config.passwordHashAlgorithm) {
        case "md5":
            user.password = security.md5(password);
            await store.users.insert(user);
            refreshRegistrationEnabled(req.app);
            signin(req, res);
            break;
        case "bcrypt":
            security.bcryptHash(password, async function (err, passwordHash) {
                user.password = passwordHash;
                await store.users.insert(user);
                refreshRegistrationEnabled(req.app);
                signin(req, res);
            });
            break;
        default:
            logger.error(
                "Incorrect passwordHashAlgorithm specified in config.json"
            );
            break;
    }
});

// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// the callback after google has authenticated the user
router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: "/dashboard",
        failureRedirect: "/dashboard/auth",
    })
);

router.get("/signout", function (req, res) {
    req.signout();
    req.session.destroy();
    if (req.xhr) {
        return res.json(true);
    }
    return res.redirect("/");
});

module.exports = router;
