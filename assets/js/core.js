/* eslint-disable no-console */

import options from "./options";

export function log (message) {
    if (options.logEnabled && console && console.log) {
        return console.log(message);
    }
    return undefined;
}

export function debug (object, title) {
    if (options.debugEnabled && console && console.debug) {
        if (title) {
            app.debug(title + ":");
        }
        return console.debug(object);
    }
    return undefined;
}

export function getQueryParam (name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export let loader = {
    show () {
        document.getElementById("loader").style.display = "block";
    },    
    hide () {
        document.getElementById("loader").style.display = "none";
    }
};

export default {
    log,
    debug,
    getQueryParam,
    loader
};