import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "@/plugins/vuetify";
import Toast from "@/plugins/toast";
import axios from "axios";

import errorHandler from "@/error-handler";
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
        let { isAuthenticated, registrationEnabled } = response.data;

        if (isAuthenticated) {
            window.location = process.env.BASE_URL.slice(0, -1);
            return;
        }

        Vue.prototype.$registrationEnabled = registrationEnabled;

        // register Toast plugin
        Vue.use(Toast);

        // start Dashboard app
        let app = new Vue({
            router,
            vuetify,
            render: h => h(App)
        }).$mount("#app");

        // catch all errors
        errorHandler(app);

        console.log(
            `Sign In to NordicSoft Express 4 Template! Environment: ${process.env.NODE_ENV}`
        );
    })
    .catch(err => {
        // TODO: redirect to `error` page
        console.error(err);
    });
