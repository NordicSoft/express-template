import Vue from "vue";
import Vuex from "vuex";
import users from "./modules/users";
import profile from "./modules/profile";
import content from "./modules/content";
import gallery from "./modules/gallery";

Vue.use(Vuex);

const state = {
    loading: false
};

const mutations = {
    loading(state, payload) {
        state.loading = payload;
    }
};

const actions = {
    loading({ commit }, payload) {
        commit("loading", payload);
    },
    async signOut() {
        await Vue.axios.get("/auth/signout");
    }
};

export default new Vuex.Store({
    modules: {
        users,
        profile,
        content,
        gallery
    },
    state,
    mutations,
    actions
});
