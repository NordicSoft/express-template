const config = require("@config"),
    logger = require("@logger"),
    axiosRetry = require("axios-retry"),
    axios = require("axios").create({
        baseURL: config.api.baseUrl,
        headers: {
            "Authorization": "Bearer " + config.api.token,
            "X-Requested-With": "XMLHttpRequest"
        }
    });

axiosRetry(axios, {
    retries: 3,
    retryDelay: (retryCount, error) => {
        logger.error("Api call error:", error.code, error.response ? error.response.status : "no response");
        logger.info("Retry "+ retryCount);
        if (!error) {
            return 0;
        }
        if (error.code === "ECONNREFUSED"
            || error.code === "ECONNRESET" 
            || (error.response && error.response.status === 504)) {
            return retryCount * retryCount * 1000; // 1 sec, 4 sec, 9 sec
        }
        return 0;
    }
});

class ApiError extends Error {
    constructor(e) {
        let response = e.response;

        if (!response) {
            console.error(e);
            super(e.message);
            this.status = 500;
            return;
        }

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
                    if (response && response.status >= 200 && response.status < 300) {
                        return response.data;
                    }
                } catch (e) {
                    if (e.response && e.response.status === 404 && e.response.statusText === e.response.data) {
                        return null;
                    }
                    throw new ApiError(e);
                }
            };
        }
        return target[name];
    }
});

module.exports.users = {
    get: async usernameOrEmail => call.get("user/" + usernameOrEmail),
    add: async user => call.post("user", user),
    canRegister: async () => call.get("users/can-register")
};

module.exports.photos = {
    all: (sort, skip, limit) => call.get("/gallery/photos", { params: { sort, skip, limit } }),
    get: id => call.get("/gallery/photo/" + id)
};

module.exports.photoSets = {
    all: (sort) => call.get("/gallery/photosets", { params: { sort } }),
    get: code => call.get("/gallery/photoset/" + code),
    getWithPhotos: code => call.get(`/gallery/photoset/${code}`, { params: { photos: true } })
};