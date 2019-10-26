import Vue from "vue";
import Vuex from "vuex";
import users from "./modules/users";
import profile from "./modules/profile";
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
    }
};

export default new Vuex.Store({
    modules: {
        users,
        profile,
        gallery
    },
    state,
    mutations,
    actions
});