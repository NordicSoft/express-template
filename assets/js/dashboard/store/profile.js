export default {
    state: {
        profile: []
    },
    mutations: {
        load(state, payload) {
            state.profile = payload;
        },
    },
    actions: {
        async load({ commit }) {
            
        }
    },
    getters: {
        profile(state) {
            return state.profile;
        }
    }
}  