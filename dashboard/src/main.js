import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import Toast from "./plugins/toast";
import axios from "axios";

import errorHandler from "./error-handler";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";

Vue.config.productionTip = false;

// setup axios
Vue.axios = Vue.prototype.$http = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    withCredentials: true,
    headers: {
        "X-Requested-With": "XMLHttpRequest"
    }
});

// register Toast plugin
Vue.use(Toast);
let app = new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount("#app");

errorHandler(app);

console.log(
    `Welcome to NordicSoft Express 4 Template! Environment: ${process.env.NODE_ENV}`
);
