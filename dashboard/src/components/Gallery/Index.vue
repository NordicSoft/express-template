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
        <draggable
            v-model="photos"
            :force-fallback="true"
            :disabled="!reorderEnabled"
            draggable=".saved-photo"
            class="d-flex flex-wrap pt-3 mx-n2"
            ghost-class="ghost"
        >
            <photo-card
                v-for="photo in photos"
                :key="photo._id"
                :photo="photo"
                :imageMimeTypes="imageMimeTypes"
                class="saved-photo"
            />
            <template v-if="activePhotoSet != 'trash'">
                <photo-card
                    v-for="photo in uploadingPhotos"
                    :key="crc(photo.src)"
                    :photo="photo"
                    :blank="true"
                    :file="photo.file"
                    :imageMimeTypes="imageMimeTypes"
                    @delete="deleteUploadingPhoto(photo)"
                    class="uploading-photo"
                />
            </template>
            <v-card
                v-if="activePhotoSet != 'trash'"
                :loading="loading"
                flat
                class="ma-2"
                width="296px"
                min-height="222px"
            >
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
        </draggable>
    </div>
</template>

<script>
import crc32 from "crc-32";
import PhotoSetChip from "./PhotoSetChip";
import PhotoCard from "./PhotoCard";
import { createNamespacedHelpers } from "vuex";
import draggable from "vuedraggable";
import XMP from "xmp-js";
// npm i exif-parser
// import exifParser from "exif-parser";

const { mapGetters } = createNamespacedHelpers("gallery");

export default {
    components: {
        PhotoSetChip,
        PhotoCard,
        draggable
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
            "unclassifiedPhotos"
        ]),
        photos: {
            get() {
                return this.$store.getters["gallery/photos"];
            },
            async set(value) {
                let ids = value.map(x => x._id);
                await this.$store.dispatch("gallery/reorderPhotos", {
                    photoSet: this.activePhotoSet,
                    photos: ids
                });
            }
        },
        reorderEnabled() {
            return !["all", "unclassified", "trash"].includes(
                this.activePhotoSet
            );
        }
    },
    methods: {
        crc: value => crc32.str(value),
        async filesMap(files) {
            let promises = Array.from(files)
                .filter(file => this.imageMimeTypes.includes(file.type))
                .map(file => {
                    let result = {
                        name: file.name,
                        alt: "", // file.name,
                        title: "",
                        description: "",
                        type: file.type,
                        size: file.size,
                        file,
                        extension: file.name.split(".").pop()
                    };
                    // check if
                    // url = URL.createObjectURL(file)
                    // ...
                    // URL.revokeObjectURL(url);
                    // performs better
                    return new Promise(resolve => {
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            result.src = e.target.result;

                            //let parser = exifParser.create(blob);
                            //let exif = parser.parse();

                            let xmp = new XMP(result.src);
                            let xmpJson = xmp.parse();
                            if (xmpJson) {
                                result.alt = xmpJson.title || "";
                                result.title = xmpJson.title || "";
                                result.description = xmpJson.description || "";
                            }
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

.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}
</style>
