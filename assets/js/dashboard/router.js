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

// make router.push silent
// https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
/*const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
    return originalPush.call(this, location).catch(err => err);
};*/

export default new Router({
    mode: "history",
    base: "/dashboard/",
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