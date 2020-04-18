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

Vue.axios("/auth")
    .then(response => {
        let { isAuthenticated } = response.data;

        if (!isAuthenticated) {
            window.location =
                process.env.VUE_APP_SIGNIN_URL +
                location.pathname +
                location.search;
            return;
        }

        // register Toast plugin
        Vue.use(Toast);

        // start Dashboard app
        let app = new Vue({
            router,
            store,
            vuetify,
            render: h => h(App)
        }).$mount("#app");

        // catch all errors
        errorHandler(app);

        console.log(
            `Welcome to NordicSoft Express 4 Template! Environment: ${process.env.NODE_ENV}`
        );
    })
    .catch(err => {
        console.error(err);
        window.location = process.env.BASE_URL + "error";
    });
