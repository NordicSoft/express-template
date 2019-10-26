import Vue from "vue";

const state = {
    photoSets: [],
    photos: [],
    activePhotoSet: "all"
};

const getters = {
    photoSets: (state) => {
        const all = {
            system: true,
            title: "All",
            code: "all",
            icon: "mdi-image-multiple"
        };
        const unclassified = {
            system: true,
            title: "Unclassified",
            code: "unclassified",
            icon: "mdi-image-filter"
        };
        return [all, ...state.photoSets, unclassified];
    },
    activePhotoSet: (state) => state.activePhotoSet,
    photos: (state, getters) => {
        switch (state.activePhotoSet) {
            case "all":
                return getters.allPhotos;
            case "unclassified":
                return getters.unclassifiedPhotos;
            default:
                return state.photos.filter(photo => photo.sets.includes(state.activePhotoSet));
        }
    },
    allPhotos: (state) => state.photos,
    unclassifiedPhotos: state => state.photos.filter(photo => !Array.isArray(photo.sets) || !photo.sets.length)
};

const mutations = {
    setPhotoSets(state, payload) {
        state.photoSets = payload;
    },
    setPhotos(state, payload) {
        state.photos = payload;
    },
    setActivePhotoSet(state, set) {
        state.activePhotoSet = set;
    },
    savePhotoSet(state, payload) {
        let photoSet = state.photoSets.find(item => {
            return item._id == payload._id;
        });
        if (photoSet) {
            photoSet.title = payload.title;
            photoSet.code = payload.code;
            photoSet.cover = payload.cover;
        } else {
            state.photoSets.push(payload);
        }
    },
    savePhoto(state, payload) {
        let photo = state.photos.find(item => {
            return item._id === payload._id;
        });
        if (photo) {
            Object.assign(photo, payload);
        } else {
            state.photos.push(payload);
        }
    },
    deletePhotoSet(state, _id) {
        let index = state.photoSets.findIndex(item => {
            return item._id === _id;
        });
        if (index !== -1) {
            // if deleted photoset is active
            if (state.activePhotoSet == state.photoSets[index].code) {
                // change active photoset
                state.activePhotoSet = index > 0 ? state.photoSets[index - 1].code : "all";
            }
            state.photoSets.splice(index, 1);
        }
    },
    deletePhoto(state, _id) {
        let index = state.photos.findIndex(item => {
            return item._id === _id;
        });
        if (index !== -1) {
            state.photos.splice(index, 1);
        }
    }
};

const actions = {
    async load({ commit }) {
        let { data: photoSets } = await Vue.axios.get("/gallery/photosets");
        commit("setPhotoSets", photoSets);
        let { data: photos } = await Vue.axios.get("/gallery/photos");
        commit("setPhotos", photos);
    },
    async savePhotoSet({ commit }, payload) {
        let formData = new FormData();
        if (payload.file) {
            formData.append("file", payload.file, payload.file.name);
        }
        if (payload._id) {
            formData.append("_id", payload._id);
        }
        formData.append("title", payload.title);
        formData.append("code", payload.code);

        let { data } = await Vue.axios.post("/gallery/photoset", formData);
        commit("savePhotoSet", data);
    },
    async savePhoto({ commit }, payload) {
        let formData = new FormData();
        if (payload.file) {
            formData.append("file", payload.file, payload.file.name);
        }
        if (payload._id) {
            formData.append("_id", payload._id);
        }
        formData.append("sets", JSON.stringify(payload.sets));
        formData.append("alt", payload.alt);
        formData.append("title", payload.title);
        formData.append("description", payload.description);
        let { data } = await Vue.axios.post("/gallery/photo", formData);
        commit("savePhoto", data);
    },
    async deletePhotoSet({ commit }, _id) {
        await Vue.axios.delete(`/gallery/photoset/${_id}`);
        commit("deletePhotoSet", _id);
    },
    async deletePhoto({ commit }, _id) {
        await Vue.axios.delete(`/gallery/photo/${_id}`);
        commit("deletePhoto", _id);
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
