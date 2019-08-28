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
        async load() {
            
        }
    },
    getters: {
        profile(state) {
            return state.profile;
        }
    }
};