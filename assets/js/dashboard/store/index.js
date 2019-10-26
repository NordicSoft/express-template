import Vue from "vue";
import Vuex from "vuex";
import users from "./modules/users";
import profile from "./modules/profile";
import gallery from "./modules/gallery";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        users,
        profile,
        gallery
    }
});