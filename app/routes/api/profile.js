const logger = require("./../../lib/logger"),
    config = require("./../../lib/config"),
    store = require("./../../store");

module.exports = function (router) {

    router.get("/profile", function (req, res) {
        let user = req.user;
        res.json({
            name: user.name,
            email: user.email
        });
    });

    router.post("/profile", async function (req, res) {
        let changes = req.body;

        // validate
        if (!changes.name) {
            return res.status(400).send("Name is required");
        }
        if (!changes.email) {
            return res.status(400).send("Email is required");
        }
        if (!/.+@.+/.test(changes.email)) {
            return res.status(400).send("Invalid email format");
        }

        await store.users.update(req.user._id, changes);

        // update current user info in session
        // see https://github.com/jaredhanson/passport/issues/208
        req.login(Object.assign(req.user, changes), function () {
            res.sendStatus(200);
        });
    });

    router.post("/change-password", async function (req, res) {
        let data = req.body,
            password = data.password,
            newPassword = data.newPassword;

        // validate
        if (!password) {
            return res.status(400).send("Current password is required");
        }
        if (!newPassword) {
            return res.status(400).send("New password is required");
        }

        const security = require("./../../lib/security"),
            user = await store.users.getById(req.user._id);

        switch (config.passwordHashAlgorithm) {
            case "md5": {
                if (security.md5(password) !== user.password) {
                    return res.status(400).send("Current password is incorrect");
                }

                let changes = { password: security.md5(newPassword) };
                await store.users.update(req.user._id, changes);
                return res.sendStatus(200);
            }
            case "bcrypt": {
                security.bcryptCheck(password, user.password, function (err, result) {
                    if (err) {
                        logger.error("password check failed", err);
                        return res.sendStatus(500);
                    }

                    if (!result) {
                        logger.info("Password is incorrect");
                        return res.status(400).send("Current password is incorrect");
                    }

                    security.bcryptHash(newPassword, async function (err, passwordHash) {
                        let changes = { password: passwordHash };
                        await store.users.update(req.user._id, changes);
                        return res.sendStatus(200);
                    });
                });
                break;
            }
            default:
                logger.error("Incorrect passwordHashAlgorithm specified in config.json");
                return res.sendStatus(500);
        }
    });

};