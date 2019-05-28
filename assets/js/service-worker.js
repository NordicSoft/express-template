/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

var HASH = "${commit}",
    CACHE_NAME = "express-template-v${version}-" + HASH,
    urlsToCache = [
        // fonts
        "/fonts/font-awesome/fontawesome-webfont.woff2?v=4.5.0",
        "/fonts/roboto/roboto-v18-cyrillic_latin-ext_latin-regular.woff2",
        "/fonts/roboto/roboto-v18-cyrillic_latin-ext_latin-italic.woff2",
        "/fonts/roboto/roboto-v18-cyrillic_latin-ext_latin-700.woff2",
        "/fonts/roboto-condensed/roboto-condensed-v16-cyrillic_latin-ext_latin-regular.woff2",
        "/fonts/roboto-condensed/roboto-condensed-v16-cyrillic_latin-ext_latin-italic.woff2"
    ];

self.addEventListener("install", function (event) {
    console.log("SW.install");
    //self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log("SW. Caching " + CACHE_NAME);
                return cache.addAll(urlsToCache);
            })
            .catch(function (error) {
                console.log("SW. Error while creating cache: ", error);
            })
    );
});

self.addEventListener("activate", function (event) {
    console.log("SW.activate");
    event.waitUntil(
        caches.keys()
            .then(function (keys) {
                return Promise.all(keys.map(function (key) {
                    if (key !== CACHE_NAME) {
                        console.log("SW. Delete cache " + key);
                        return caches.delete(key);
                    }
                }));
            })
    );
});

self.addEventListener("fetch", function (event) {
    console.log(`SW.fetch ${event.request.method} ${event.request.url}`);
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (!response) {
                    console.log(`SW. Get ${event.request.url} from the network`);
                    return fetch(event.request);
                }
                
                console.log(`SW. Get ${event.request.url} from the cache`);
                return response;
            })
            .catch(function (error) {
                console.log("SW. caches.match - error", error);
            })
    );
});

self.addEventListener("message", function (event) {
    console.log("SW.message");
});

self.addEventListener("sync", function (event) {
    console.log("SW.sync");
});

self.addEventListener("push", function (event) {
    console.log("SW.push");
});