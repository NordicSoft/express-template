const config = require("@config"),
    axios = require("axios").create({
        baseURL: config.api.baseUrl,
        headers: {
            "Authorization": "Bearer " + config.api.token,
            "X-Requested-With": "XMLHttpRequest"
        }
    });

class ApiError extends Error {
    constructor(e) {
        let response = e.response;
        super(`${response.status} ${response.statusText}`);
        this.status = response.status;
        if (response.statusText !== response.data) {
            this.data = response.data;
        }
    }
}

const call = new Proxy(axios, {
    get(target, name) {
        const methods = ["request", "get", "delete", "head", "options", "post", "put", "patch"];
        if (methods.includes(name) && typeof target[name] === "function") {
            return async function() {
                try {
                    let response = await target[name].apply(target, arguments);
                    if (response.status >= 200 && response.status < 300) {
                        return response.data;
                    }
                } catch (e) {
                    throw new ApiError(e);
                }
            };
        }
        return target[name];
    }
});

module.exports.users = {
    get: async usernameOrEmail => call.get("users/" + usernameOrEmail)
};

module.exports.photos = {
    all: () => call.get("/gallery/photos"),
    get: id => call.get("/gallery/photo/" + id)
};

module.exports.photoSets = {
    notEmpty: () => call.get("/gallery/photosets/not-empty"),
    get: code => call.get("/gallery/photoset/" + code),
    getWithPhotos: code => call.get(`/gallery/photoset/${code}?photos=true`)
};