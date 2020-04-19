import Vue from "vue";
import Router from "vue-router";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
//import Content from "./pages/Content";
//import Gallery from "./pages/Gallery";
import Files from "./pages/Files";
import SendEmail from "./pages/SendEmail";
import GoogleMaps from "./pages/GoogleMaps";

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
            // component: Gallery,
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import(/* webpackChunkName: "gallery" */ "@/pages/Gallery.vue"),
            props: true
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
            path: "/content/:editContent?",
            name: "content",
            // component: Content,
            component: () =>
                import(/* webpackChunkName: "content" */ "@/pages/Content.vue"),
            props: true
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
