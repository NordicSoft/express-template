import Vue from "vue";
import Router from "vue-router";
import SignIn from "./SignIn";
import Register from "./Register";

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL + "auth/",
    routes: [
        {
            path: "",
            name: "signin",
            component: SignIn
        },
        {
            path: "/register",
            name: "register",
            component: Register
        }
    ]
});
