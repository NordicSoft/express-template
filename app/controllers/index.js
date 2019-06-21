var controller = require("express").Router(),
    config = require("./../lib/config"),
    logger = require("./../lib/logger"),
    store = require("./../store");


function signin(req, res) {
    req.signin(function (err, user, info) {
        if (user) {
            return res.status(200).json({}).end();
        } else {
            return res.error(400, { json: { message: info } });
        }
    });
}

controller.get("/", function (req, res) {
    res.locals.model = {
        isAuthenticated: req.isAuthenticated()
    };
    return res.render("welcome/index");
});

controller.get("/signin", function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect("/dashboard");
    }
    if (req.xhr) {
        return res.error(404);
    } else {
        //return res.render('signin', { layout: false });
        return res.render("welcome/signin");
    }
});

controller.get("/register", function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect("/dashboard");
    }
    if (req.xhr) {
        return res.error(404);
    } else {
        return res.render("welcome/register");
    }
});

controller.get("/check-email", async function (req, res) {
    if (req.xhr) {
        var email = req.query.email,
            user = await store.getUserByEmail(email);
        res.send(!user);
    } else {
        return res.error(404);
    }
});

controller.post("/signin", signin);

controller.post("/register", async function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect("/dashboard");
    }

    let name = req.body.name,
        email = req.body.email,
        password = req.body.password,
        passwordConfirm = req.body.passwordConfirm;

    logger.info(`Register new user ${name} (${email})`);

    if (password !== passwordConfirm) {
        return res.error(400, { json: { message: "Password and confirm password does not match" } });
    }

    // check username
    if (await store.getUserByEmail(email)) {
        return res.error(400, { json: { message: "This email is already taken" } });
    }

    let usersCollection = await store.getUsers();
    let security = require("./../lib/security");
    let user = {
        name,
        email,
    };

    switch (config.passwordHashAlgorithm) {
        case "md5":
            user.password = security.md5(password);
            await usersCollection.insertOne(user);
            signin(req, res);
            break;
        case "bcrypt":
            security.bcryptHash(password, async function (err, passwordHash) {
                user.password = passwordHash;
                await usersCollection.insertOne(user);
                signin(req, res);
            });
            break;
        default:
            logger.error("Incorrect passwordHashAlgorithm specified in config.json");
            break;
    }
});

controller.get("/signout", function (req, res) {
    req.signout();
    return res.redirect("/");
});

controller.get("/*", function (req, res) {
    var view = "welcome/" + req.url,
        options = {};

    var renderCallback = function (err, html) {
        if (err) {
            if (err.message.indexOf("Failed to lookup view") !== -1) {
                return res.error(404, options);
            }
            throw err;
        }
        res.send(html);
    };

    return res.renderPage(view, options, renderCallback);
});

module.exports = controller;