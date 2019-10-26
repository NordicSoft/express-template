import Vue from "vue";

export default {
    state: {
        profile: []
    },
    mutations: {
        setProfile(state, payload) {
            state.profile = payload;
        },
    },
    actions: {
        async load({ commit }) {
            let { data } = await Vue.axios.get("/profile");
            commit("setProfile", data);
        }
    },
    getters: {
        profile(state) {
            return state.profile;
        }
    }
};