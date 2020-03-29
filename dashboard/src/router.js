import Vue from "vue";
import Router from "vue-router";
import Home from "./pages/Home";
import Users from "./pages/Users";
import SendEmail from "./pages/SendEmail";
import GoogleMaps from "./pages/GoogleMaps";
import Gallery from "./pages/Gallery";
import Files from "./pages/Files";
import Profile from "./pages/Profile";

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "",
            name: "home",
            component: Home
        },
        {
            path: "/users",
            name: "users",
            component: Users
        },
        {
            path: "/send-email",
            name: "sendEmail",
            component: SendEmail
        },
        {
            path: "/google-maps",
            name: "googleMaps",
            component: GoogleMaps
        },
        {
            path: "/gallery/:initPhotoSet",
            name: "gallery",
            component: Gallery,
            props: true

            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            // component: () => import(/* webpackChunkName: "about" */ "../views/About.vue")
        },
        {
            path: "/gallery",
            redirect: "/gallery/all"
        },
        {
            path: "/files",
            name: "files",
            component: Files
        },
        {
            path: "/profile/:initTab",
            name: "profile",
            component: Profile,
            props: true
        },
        {
            path: "/profile",
            redirect: "/profile/general"
        }
    ]
});
