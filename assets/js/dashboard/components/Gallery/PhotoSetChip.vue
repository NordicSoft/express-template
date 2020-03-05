<template>
    <v-menu
        v-model="menu"
        offset-y
        :close-on-content-click="false"
        :disabled="!editable || !active"
    >
        <confirm ref="confirm"></confirm>
        <template v-slot:activator="{ on }">
            <!-- <v-avatar v-if="blank" v-on="on" @click="$emit('click')"></v-avatar> -->
            <v-btn
                v-if="blank"
                v-on="on"
                @click="$emit('click')"
                depressed
                color="blue-grey lighten-5"
                class="blank"
            >
                <v-icon color="white">mdi-plus</v-icon>
            </v-btn>
            <v-chip
                v-else
                pill
                class="my-2"
                v-on="on"
                :color="active ? activeColor : color"
                :class="{ 'v-chip--active': active }"
                @click="$emit('click')"
                :value="photoSet.code"
            >
                <v-avatar left :color="active ? activePillColor : pillColor">
                    <v-img
                        v-if="photoSet && photoSet.cover"
                        :src="photoSet.cover"
                        :key="crc(photoSet.cover)"
                    ></v-img>
                    <v-icon v-else-if="icon" :text="icon">{{icon}}</v-icon>
                </v-avatar>
                {{photoSet.title}}
            </v-chip>
        </template>
        <v-card v-if="editable && active" :loading="loading" width="296">
            <v-img :src="newCoverSrc" width="296px" height="222px" :key="crc(newCoverSrc)"></v-img>
            <v-btn class="btn-change-cover" @click="$refs.inputCoverUpload.click()">
                <v-icon>mdi-square-edit-outline</v-icon>
                <input
                    v-show="false"
                    ref="inputCoverUpload"
                    type="file"
                    :accept="imageMimeTypes.join(',')"
                    @change="changeCover"
                />
            </v-btn>
            <v-card-text class="pb-0 pt-1">
                <v-text-field v-model="newTitle" label="Title" required hide-details></v-text-field>
                <v-text-field v-model="newCode" label="Code" required hide-details></v-text-field>
            </v-card-text>
            <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn v-if="blank" depressed @click="menu = false">
                    <v-icon left>mdi-cancel</v-icon>Cancel
                </v-btn>
                <v-btn v-if="blank" depressed color="info" @click="save">
                    <v-icon left>mdi-plus</v-icon>Add
                </v-btn>
                <v-btn v-if="!blank" depressed color="error" @click="remove">
                    <v-icon left>mdi-delete-outline</v-icon>Delete
                </v-btn>
                <v-btn v-if="!blank" depressed color="success" @click="save">
                    <v-icon left>mdi-check</v-icon>Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>

<script>
import crc32 from "crc-32";
import Confirm from "./../Confirm.vue";

export default {
    props: {
        imageMimeTypes: Array,
        photoSet: Object,
        editable: { type: Boolean, default: true },
        active: Boolean,
        blank: Boolean,
        icon: String,
        color: { type: String, default: "grey lighten-3" },
        pillColor: { type: String, default: "grey lighten-2" },
        activeColor: { type: String, default: "green lighten-1" },
        activePillColor: { type: String, default: "green lighten-3" }
    },
    components: {
        Confirm
    },
    data() {
        return {
            menu: false,
            loading: false,
            newCoverSrc: this.blank ? "" : this.photoSet.cover || "",
            newCoverFile: null,
            newTitle: this.blank ? "" : this.photoSet.title,
            newCode: this.blank ? "" : this.photoSet.code
        };
    },
    methods: {
        crc: value => crc32.str(value),
        async save() {
            this.loading = true;
            await this.$store.dispatch("gallery/savePhotoSet", {
                _id: this.blank ? null : this.photoSet._id,
                file: this.newCoverFile,
                title: this.newTitle,
                code: this.newCode
            });
            this.$toast.success(`Photo set ${this.blank ? "added" : "saved"}`);
            // close menu
            this.menu = false;
            this.loading = false;
        },
        async remove() {
            let confirmed = await this.$refs.confirm.open(
                "Delete?",
                `Are you sure<br>you want to delete the "${this.photoSet.title}" photo set?
                Photos related to this photo set will <b>not</b> be deleted`
            );

            if (confirmed) {
                this.loading = true;
                await this.$store.dispatch(
                    "gallery/deletePhotoSet",
                    this.photoSet._id
                );
                this.$toast.success("Photo set deleted");
                this.loading = false;
            }
        },
        changeCover(event) {
            this.loading = true;
            this.newCoverFile = event.target.files[0];
            var reader = new FileReader();
            reader.onload = e => {
                this.newCoverSrc = e.target.result;
                this.loading = false;
            };
            reader.readAsDataURL(this.newCoverFile);
        }
    }
};
</script>

<style lang="scss" scoped>
.v-chip--pill {
    font-size: 18px;
    height: 36px;
    color: #555;
    overflow: visible;
    position: relative;
    left: 2px;

    &.v-chip--active {
        color: #fff;
    }

    .v-avatar {
        height: 48px !important;
        width: 48px !important;
        position: relative;
        left: -1px;
    }
}

.blank {
    margin-top: 3px;
    height: 48px !important;
    width: 48px !important;
    min-width: 48px !important;
    border-radius: 50%;

    .v-icon {
        font-size: 32px;
    }
}

.v-menu__content {
    margin-top: 10px;

    .v-card {
        position: relative;

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

        .v-input__slot {
            margin-bottom: 5px !important;
        }
    }
}
</style>