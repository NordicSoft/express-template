<template>
    <v-card :elevation="blank ? 10 : 0" class="ma-2" :loading="loading">
        <v-img :src="newPhotoSrc" width="296px" height="222px" :key="crc(newPhotoSrc)"></v-img>
        <v-btn class="btn-change-cover" @click="$refs.inputCoverUpload.click()">
            <v-icon>mdi-square-edit-outline</v-icon>
            <input
                v-show="false"
                ref="inputCoverUpload"
                type="file"
                :accept="imageMimeTypes.join(',')"
                @change="changePhoto($event.target.files[0])"
            />
        </v-btn>
        <v-card-text class="pb-0 pt-1">
            <v-autocomplete
                v-model="newSets"
                :items="photoSets"
                chips
                hide-details
                label="Photo Sets"
                item-text="title"
                item-value="code"
                multiple
                append-icon
            >
                <template v-slot:selection="data">
                    <v-chip
                        v-bind="data.attrs"
                        :input-value="data.selected"
                        pill
                        close
                        @click="data.select"
                        @click:close="removePhotoSet(data.item)"
                        class="ml-0"
                    >
                        <v-avatar left class="mr-1">
                            <v-img :src="data.item.cover"></v-img>
                        </v-avatar>
                        {{ data.item.title }}
                    </v-chip>
                </template>
                <template v-slot:item="data">
                    <v-list-item-avatar>
                        <v-img :src="data.item.cover" :key="crc(data.item.cover || '')" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title v-html="data.item.title"></v-list-item-title>
                    </v-list-item-content>
                </template>
            </v-autocomplete>
            <v-text-field v-model="newAlt" label="Alt" required hide-details></v-text-field>
            <v-text-field v-model="newTitle" label="Title" required hide-details></v-text-field>
            <v-textarea v-model="newDescription" label="Description" rows="3" hide-details></v-textarea>
        </v-card-text>
        <v-card-actions>
            <div class="flex-grow-1"></div>
            <template v-if="blank">
                <v-btn depressed @click="cancel">
                    <v-icon left>mdi-cancel</v-icon>Cancel
                </v-btn>
                <v-btn depressed color="info" @click="save">
                    <v-icon left>mdi-upload-outline</v-icon>Upload
                </v-btn>
            </template>
            <template v-else-if="photo.deleted">
                <v-btn depressed color="error" @click="remove">
                    <v-icon left>mdi-delete-outline</v-icon>Delete
                </v-btn>
                <v-btn depressed color="success" @click="restore">
                    <v-icon left>mdi-undo-variant</v-icon>Restore
                </v-btn>
            </template>
            <template v-else>
                <v-btn depressed color="warning" @click="remove">
                    <v-icon left>mdi-delete-outline</v-icon>Delete
                </v-btn>
                <v-btn depressed color="success" @click="save">
                    <v-icon left>mdi-check</v-icon>Save
                </v-btn>
            </template>
        </v-card-actions>
    </v-card>
</template>

<script>
import crc32 from "crc-32";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapGetters } = createNamespacedHelpers("gallery");

export default {
    props: {
        imageMimeTypes: Array,
        photo: Object,
        file: File,
        blank: Boolean
    },
    data() {
        let photoSets = this.$store.getters["gallery/photoSets"];
        let activePhotoSet = this.$store.getters["gallery/activePhotoSet"];
        let blankPhotoSets = [];
        if (!photoSets.find(x => x.code == activePhotoSet).system) {
            blankPhotoSets.push(activePhotoSet);
        }

        return {
            loading: false,
            newPhotoSrc: this.blank ? "" : this.thumbnailSrc(this.photo.src) || "",
            newSets: this.blank ? blankPhotoSets : [...this.photo.sets] || [],
            newPhotoFile: this.file,
            newAlt: this.photo.alt,
            newTitle: this.photo.title,
            newDescription: this.photo.description
        };
    },
    computed: {
        ...mapState({
            photoSets: "photoSets"
        }),
        ...mapGetters(["activePhotoSet"])
    },
    methods: {
        thumbnailSrc(src) {
            try {
                let lastDotIndex = src.lastIndexOf("."),
                    extension = src.substring(lastDotIndex),
                    name = src.substring(0, lastDotIndex);
                return `${name}_tm${extension}`;
            } catch (err) {
                // silent
                return src;
            }
        },
        crc: value => crc32.str(value),
        async save() {
            this.loading = true;
            await this.$store.dispatch("gallery/savePhoto", {
                _id: this.blank ? null : this.photo._id,
                file: this.newPhotoFile,
                sets: this.newSets,
                alt: this.newAlt,
                title: this.newTitle,
                description: this.newDescription
            });
            if (this.blank) {
                this.$emit("delete");
            }
            this.$toast.success(`Photo ${this.blank ? "uploaded" : "saved"}`);
            this.loading = false;
        },
        async remove() {
            this.loading = true;
            await this.$store.dispatch("gallery/deletePhoto", this.photo._id);
            this.$toast.success("Photo deleted");
            this.loading = false;
        },
        cancel() {
            this.$emit("delete");
        },
        async restore() {
            this.loading = true;
            await this.$store.dispatch("gallery/restorePhoto", this.photo._id);
            this.$toast.success("Photo restored");
            this.loading = false;
        },
        removePhotoSet(item) {
            const index = this.newSets.indexOf(item.code);
            if (index >= 0) {
                this.newSets.splice(index, 1);
            }
        },
        changePhoto(file) {
            this.loading = true;
            this.newPhotoFile = file;
            var reader = new FileReader();
            reader.onload = e => {
                this.newPhotoSrc = e.target.result;
                this.loading = false;
            };
            reader.readAsDataURL(this.newPhotoFile);
        }
    },
    watch: {
        activePhotoSet(newValue, oldValue) {
            // if not a new photo or more than 1 photoset is selected - return
            if (!this.blank || this.newSets.length > 1) {
                return;
            }

            // if new photoset is system - empty selected photosets and return
            if (this.photoSets.every(x => x.code !== newValue)) {
                this.newSets.splice(0);
                return;
            }

            // if photosets untouched - update it regarding to the active one
            if (this.newSets.length === 0 || this.newSets[0] == oldValue) {
                this.$set(this.newSets, 0, newValue);
            }
        }
    },
    mounted() {
        if (this.blank && this.file) {
            this.changePhoto(this.file);
        }
    }
};
</script>

<style lang="scss" scoped>
.v-card {
    position: relative;

    ::v-deep .v-select.v-select--chips {
        max-width: 264px;

        .v-label:not(.v-label--active) {
            top: 12px;
        }

        .v-select__selections {
            min-height: 40px;
        }

        .v-chip__content {
            line-height: 15px;
        }

        .v-chip__close.v-icon.v-icon--right {
            margin-left: 3px;
            margin-right: -8px;
        }
    }

    .v-image {
        background: #eee;
    }

    .btn-change-cover {
        position: absolute;
        width: 48px !important;
        min-width: 48px !important;
        height: 48px !important;
        right: 10px;
        top: 164px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.3) !important;
        color: rgba(0, 0, 0, 0.8) !important;
        box-shadow: none;
        transition: background-color 250ms;

        &:hover {
            background-color: rgba(255, 255, 255, 0.6) !important;
        }
    }

    .v-input {
        margin-bottom: 10px;
    }
}
</style>