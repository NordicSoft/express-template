module.exports.init = function (server, session) {

    var io = require("socket.io")(server, { path: "/ws", serveClient: false }),
        logger = require("./../lib/logger"),
        clone = require("clone"),
        minimatch = require("minimatch");

    // enable CORS
    io.origins((origin, callback) => {
        // allow all origins
        callback(null, true);
    });

    // socket.io session middleware
    io.use(function (socket, next) {
        session(socket.request, socket.request.res || {}, next);
    });

    // socket.io authentication middleware
    io.use(function (socket, next) {
        var session = socket.request.session;
        if (session && session.passport && session.passport.user !== undefined) {
            var user = session.passport.user;
            logger.debug("Socket.io authentication. UserId: " + user._id);
            if (user) {
                socket.user = clone(user);
                return next();
            }

            return next(new Error("not authorized"));
        }
        //logger.warn("Socket.io - not authorized access");
        //next(new Error("not authorized"));
        // TODO: implement socket authentication
        next();
    });

    // catch all socket events
    // based on: http://stackoverflow.com/a/33960032/2550004
    io.use(function (socket, next) {
        var onevent = socket.onevent;
        socket.onevent = function (packet) {
            onevent.call(this, packet);    // original call

            // if listener for event was not found - call wildcard listener
            var eventName = packet.data[0];
            if (socket.eventNames().indexOf(eventName) === -1) {
                packet.data = ["*"].concat(packet.data || []);
                onevent.call(this, packet);      // additional call to catch-all
            }
        };
        next();
    });

    io.on("connection", function (socket) {

        socket.on("join", function (room) {
            room = socket.user.id + "/" + room;
            logger.info("Join the room " + room);
            socket.join(room);
        });

        // supports glob syntax
        socket.on("leave", function (room) {
            // iterate socket.rooms object keys after first two.
            // The first room is connection id room, the second is user id room
            var rooms = Object.keys(socket.rooms);
            for (var i = 2, n = rooms.length; i < n; i++) {
                if (minimatch(rooms[i], "*/" + room)) {
                    socket.leave(rooms[i]);
                }
            }
        });

        // activate socket.io handlers
        require("./hello")(io, socket);

        logger.debug(socket.user._id);

        // join `user id` room
        socket.join(socket.user._id);

        socket.on("error", function (error) {
            logger.error("Socket.io error occurred: ");
            logger.error(error);
        });

        socket.on("*", function (event, data) {
            var userId = socket.user ? socket.user.id : "?";
            logger.warn("Unknown socket.io event '%s' from user '%s'. Data: %j", event, userId, data);
        });
    });

    module.exports = io;

    return module.exports;
};