import "babel-polyfill";
import Vue from "vue";
import Vuetify from "vuetify";
import colors from "vuetify/es5/util/colors"
import axios from "axios";
//import BootstrapVue from "bootstrap-vue";

import { log } from "core";
import options from "options";
import App from "./App";
import router from "./router"
import store from "./store"

Vue.use(Vuetify);
//Vue.use(BootstrapVue);

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

var app = new Vue({
    el: "#app",
    router,
    store,
    components: { App },
    template: "<App/>"
});

log("Welcome to NordicSoft Express 4 Template! Environment: " + options.env);