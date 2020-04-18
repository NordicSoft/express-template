import Vue from "vue";
import _ from "lodash";

const state = {
    photoSets: [],
    photos: [],
    activePhotoSet: "all",
    newPhotosFirst: process.env.VUE_APP_GALLERY_NEW_PHOTOS_FIRST === "true"
};

const getters = {
    photoSets: (state, getters) => {
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

        let result = [all, ...state.photoSets, unclassified];
        // if there are some deleted photos then add 'Trash' photoset
        if (getters.deletedPhotos.length > 0) {
            result.push({
                system: true,
                title: "Trash",
                code: "trash",
                icon: "mdi-delete-outline"
            });
        }
        return result;
    },
    activePhotoSet: state => state.activePhotoSet,
    photos: (state, getters) => {
        let result;
        switch (state.activePhotoSet) {
            case "all":
                result = getters.allPhotos;
                break;
            case "unclassified":
                result = getters.unclassifiedPhotos;
                break;
            case "trash":
                result = getters.deletedPhotos;
                break;
            default: {
                let photoSet = state.photoSets.find(
                    photoSet => photoSet.code === getters.activePhotoSet
                );
                if (!photoSet) {
                    return [];
                }
                result = photoSet.photos
                    .map(id => {
                        let photo = state.photos.find(x => x._id === id);
                        if (photo && !photo.deleted) {
                            return photo;
                        }
                    })
                    .filter(x => !!x);
                break;
            }
        }
        if (state.newPhotosFirst) {
            result.reverse();
        }
        return result;
    },
    allPhotos: state => state.photos.filter(photo => !photo.deleted),
    unclassifiedPhotos: state =>
        state.photos.filter(
            photo =>
                !photo.deleted &&
                (!Array.isArray(photo.sets) || !photo.sets.length)
        ),
    deletedPhotos: state => state.photos.filter(photo => photo.deleted),
    newPhotosFirst: state => state.newPhotosFirst
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
            // existed photo
            if (!_.isEqual(photo.sets, payload.sets)) {
                // if sets changed
                // update all related photoSets
                let addToSets = _.difference(payload.sets, photo.sets),
                    removeFromSets = _.difference(photo.sets, payload.sets);

                // add to sets
                state.photoSets
                    .filter(set => addToSets.includes(set.code))
                    .forEach(set => {
                        set.photos.push(photo._id);
                    });

                // remove from sets
                state.photoSets
                    .filter(set => removeFromSets.includes(set.code))
                    .forEach(set => {
                        let index = set.photos.indexOf(photo._id);
                        if (index !== -1) {
                            set.photos.splice(index, 1);
                        }
                    });
            }

            Object.assign(photo, payload);
        } else {
            // new photo
            state.photos.push(payload);
            // add new photo to all selected photo sets
            payload.sets.forEach(code => {
                let photoSet = state.photoSets.find(x => x.code === code);
                photoSet.photos.push(payload._id);
            });
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
                state.activePhotoSet =
                    index > 0 ? state.photoSets[index - 1].code : "all";
            }
            state.photoSets.splice(index, 1);
        }
    },
    deletePhoto(state, { _id, deleted }) {
        let index = state.photos.findIndex(item => {
            return item._id === _id;
        });
        if (deleted) {
            // add vuex state's `deleted` property dynamically
            Vue.set(state.photos[index], "deleted", deleted);
            return;
        }

        if (index !== -1) {
            state.photos.splice(index, 1);

            // remove from photoSets
            state.photoSets.forEach(set => {
                let index = set.photos.indexOf(_id);
                if (index !== -1) {
                    set.photos.splice(index, 1);
                }
            });
        }
    },
    restorePhoto(state, _id) {
        let photo = state.photos.find(item => {
            return item._id === _id;
        });
        // remove vuex state's `deleted` property dynamically
        Vue.delete(photo, "deleted");
    },
    reorderPhotos(state, payload) {
        let photoSet = state.photoSets.find(x => x.code === payload.photoSet);
        photoSet.photos = payload.photos;
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
    async deletePhoto({ commit, getters }, _id) {
        let { data } = await Vue.axios.delete(`/gallery/photo/${_id}`);
        commit("deletePhoto", data);
        // if there are no remaining photos in trash
        if (
            getters.activePhotoSet == "trash" &&
            getters.deletedPhotos.length === 0
        ) {
            // go to 'All' photoset
            commit("setActivePhotoSet", "all");
        }
    },
    async restorePhoto({ commit, getters }, _id) {
        await Vue.axios.post("/gallery/photo/restore", { _id });
        commit("restorePhoto", _id);
        // if there are no remaining photos in trash
        if (
            getters.activePhotoSet == "trash" &&
            getters.deletedPhotos.length === 0
        ) {
            // go to 'All' photoset
            commit("setActivePhotoSet", "all");
        }
    },
    async reorderPhotos({ commit, getters }, payload) {
        if (getters.newPhotosFirst) {
            payload.photos.reverse();
        }
        await Vue.axios.post("/gallery/photos/reorder", payload);
        commit("reorderPhotos", payload);
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
