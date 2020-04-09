/* eslint-disable no-console */

import options from "./options";

export function log (message) {
    if (options.logEnabled && console && console.log) {
        return console.log(message);
    }
    return undefined;
}

export function debug (object) {
    if (options.debugEnabled && console && console.debug) {
        return console.debug(object);
    }
    return undefined;
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
    loader
};