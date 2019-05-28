import "babel-polyfill";
import Vue from "vue";
//import BootstrapVue from "bootstrap-vue";
//import Vuetify from "vuetify";
//import "node_modules/vuetify/dist/vuetify.css";
import Vuetify from "vuetify";

import { log } from "core";
import options from "options";
import App from "./App";
import router from "./router"
import store from "./store"

//Vue.use(BootstrapVue);

Vue.use(Vuetify);

//Vue.options.delimiters = ["[[","]]"];

var app = new Vue({
    el: "#app",
    router,
    //store,
    components: { App },
    template: "<App/>"
});

log("Welcome to NordicSoft Express 4 Template! Environment: " + options.env);