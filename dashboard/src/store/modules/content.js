import Vue from "vue";

const state = {
    content: [],
    active: ""
};

const getters = {
    content: state => state.content.filter(x => !x.deleted),
    active: state =>
        state.active === ""
            ? {}
            : state.content.find(x => x.code === state.active)
};

const mutations = {
    setContent(state, payload) {
        state.content = payload;
    },
    setActive(state, code) {
        state.active = code;
    },
    save(state, payload) {
        let content = state.content.find(item => {
            return item._id == payload._id;
        });
        if (content) {
            content.code = payload.code;
            content.text = payload.text;
        } else {
            state.content.push(payload);
        }
    },
    delete(state, { _id, deleted }) {
        let index = state.content.findIndex(item => {
            return item._id === _id;
        });
        if (deleted) {
            // add vuex state's `deleted` property dynamically
            Vue.set(state.content[index], "deleted", deleted);
            return;
        }

        if (index !== -1) {
            state.content.splice(index, 1);
        }
    },
    restore(state, _id) {
        let content = state.content.find(item => {
            return item._id === _id;
        });
        // remove vuex state's `deleted` property dynamically
        Vue.delete(content, "deleted");
    }
};

const actions = {
    async load({ commit }) {
        let { data: content } = await Vue.axios.get("/content");
        commit("setContent", content);
    },
    async save({ commit }, payload) {
        let { data } = await Vue.axios.post("/content", payload);
        commit("save", data);
    },
    async delete({ commit }, _id) {
        await Vue.axios.delete(`/content/${_id}`);
        commit("delete", _id);
    },
    async restore({ commit }, _id) {
        await Vue.axios.post("/content/restore", { _id });
        commit("restore", _id);
    }
};

export default {
    namespaced: true,
    strict: process.env.NODE_ENV !== "production",
    state,
    getters,
    mutations,
    actions
};
