import "babel-polyfill";
import Vue from "vue";
import vuetify from "./plugins/vuetify";
import Toast from "./plugins/toast";
import axios from "axios";

import { log } from "core";
import options from "options";
import App from "./App";
import router from "./router";
import errorHandler from "./error-handler";
import store from "./store";

// setup axios
Vue.axios = Vue.prototype.$http = axios.create({
    baseURL: "/api",
    headers: {
        "X-Requested-With": "XMLHttpRequest"
    }
});

// register Toast plugin
Vue.use(Toast);

var app = new Vue({
    el: "#app",
    vuetify,
    router,
    store,
    components: { App },
    template: "<App/>"
});

errorHandler(app);

log("Welcome to NordicSoft Express 4 Template! Environment: " + options.env);