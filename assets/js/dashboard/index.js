import "babel-polyfill";
import Vue from "vue";
import Vuetify from "vuetify";
import Toast from "./plugins/toast";
import axios from "axios";
//import BootstrapVue from "bootstrap-vue";

import { log } from "core";
import options from "options";
import App from "./App";
import router from "./router";
import errorHandler from "./error-handler";
import store from "./store";

// register Vuetify
Vue.use(Vuetify);

// register Toast plugin
Vue.use(Toast);

//Vue.use(BootstrapVue);

// set axios defaults
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

var app = new Vue({
    el: "#app",
    router,
    store,
    components: { App },
    template: "<App/>"
});

errorHandler(app);

log("Welcome to NordicSoft Express 4 Template! Environment: " + options.env);