<template>
    <div>
        <div class="d-flex mx-n1">
            <div style="max-width: calc(100% - 50px);">
                <v-chip-group show-arrows center-active :value="activePhotoSet">
                    <photo-set-chip
                        v-for="photoSet in photoSets"
                        :key="photoSet._id"
                        :photoSet="photoSet"
                        :active="activePhotoSet === photoSet.code"
                        :imageMimeTypes="imageMimeTypes"
                        :editable="!photoSet.system"
                        :icon="photoSet.icon"
                        :color="photoSet.system ? undefined : 'blue lighten-4'"
                        @click="setActivePhotoSet(photoSet.code)"
                    />
                </v-chip-group>
            </div>
            <photo-set-chip
                :editable="true"
                :active="true"
                :blank="true"
                :imageMimeTypes="imageMimeTypes"
            />
        </div>
        <div class="d-flex flex-wrap pt-3 mx-n2">
            <photo-card
                v-for="photo in photos"
                :key="photo._id"
                :photo="photo"
                :imageMimeTypes="imageMimeTypes"
            />
            <photo-card
                v-for="(photo) in uploadingPhotos"
                :key="crc(photo.src)"
                :photo="photo"
                :blank="true"
                :file="photo.file"
                :imageMimeTypes="imageMimeTypes"
                @delete="deleteUploadingPhoto(photo)"
            />
            <v-card v-if="activePhotoSet != 'trash'" :loading="loading" flat class="ma-2" width="296px" min-height="222px">
                <v-btn
                    @click="$refs.inputUpload.click()"
                    depressed
                    color="blue-grey lighten-5"
                    class="add-files"
                >
                    <v-icon color="white">mdi-plus</v-icon>
                    <input
                        v-show="false"
                        ref="inputUpload"
                        type="file"
                        multiple
                        :accept="imageMimeTypes.join(',')"
                        @change="addPhotos"
                    />
                </v-btn>
            </v-card>
        </div>
    </div>
</template>

<script>
import crc32 from "crc-32";
import PhotoSetChip from "./PhotoSetChip";
import PhotoCard from "./PhotoCard";
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("gallery");

export default {
    components: {
        PhotoSetChip,
        PhotoCard
    },
    data() {
        return {
            loading: false,
            imageMimeTypes: ["image/png", "image/jpeg"],
            uploadingPhotos: []
        };
    },
    computed: {
        ...mapGetters([
            "photoSets",
            "activePhotoSet",
            "allPhotos",
            "photos",
            "unclassifiedPhotos"
        ])
    },
    methods: {
        crc: value => crc32.str(value),
        async filesMap(files) {
            let promises = Array.from(files)
                .filter(file => this.imageMimeTypes.includes(file.type))
                .map(file => {
                    let result = {
                        name: file.name,
                        // TODO: prepopulate with data from EXIF if possible
                        alt: file.name,
                        title: "",
                        description: "",
                        type: file.type,
                        size: file.size,
                        file,
                        extension: file.name.split(".").pop()
                    };
                    return new Promise(resolve => {
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            result.src = e.target.result;
                            resolve(result);
                        };
                        reader.readAsDataURL(file);
                    });
                });

            return Promise.all(promises);
        },
        setActivePhotoSet(value) {
            this.$store.commit("gallery/setActivePhotoSet", value);
        },
        async addPhotos(event) {
            this.loading = true;
            let files = await this.filesMap(event.target.files);
            this.uploadingPhotos.push(...files);
            this.$refs.inputUpload.value = "";
            this.loading = false;
        },
        deleteUploadingPhoto(photo) {
            let index = this.uploadingPhotos.indexOf(photo);
            if (index !== -1) {
                this.uploadingPhotos.splice(index, 1);
            }
        }
    },
    async created() {
        this.$store.dispatch("loading", true);
        await this.$store.dispatch("gallery/load");
        this.$store.dispatch("loading", false);
    }
};
</script>

<style lang="scss" scoped>
::v-deep .v-chip-group {
    .v-slide-group__next,
    .v-slide-group__prev {
        min-width: 36px;
        width: 36px;
        flex-basis: 36px;
    }

    .v-slide-group__content {
        padding: 0;
    }
}
.v-btn.add-files {
    width: 100% !important;
    height: 100% !important;

    .v-icon {
        font-size: 64px;
    }
}
</style>