<template>
    <v-container fluid>
        <v-row dense align="stretch">
            <v-col v-for="item in content" :key="item.code" cols="12" md="6">
                <v-card class="pa-2" height="100%">
                    <v-card-title>
                        {{ item.code }}
                    </v-card-title>
                    <v-card-text>
                        <div
                            class="preview"
                            ref="preview"
                            v-html="item.text"
                        ></div>
                        <v-btn
                            icon
                            :disabled="loading"
                            @click="edit(item.code)"
                            class="btn-edit"
                        >
                            <v-icon>mdi-square-edit-outline</v-icon>
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-btn fixed dark fab bottom right color="success" @click="edit('')">
            <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-dialog
            v-model="dialog"
            persistent
            max-width="650px"
            :fullscreen="$vuetify.breakpoint.xs"
        >
            <v-card :tile="$vuetify.breakpoint.sm" class="d-flex flex-column">
                <v-card-title>
                    <span class="headline">
                        {{ id ? "Edit" : "Add" }} Content
                    </span>
                </v-card-title>
                <v-card-text class="flex-grow-1 pt-3">
                    <v-alert
                        v-if="description"
                        type="info"
                        outlined
                        dense
                        color="blue-grey"
                    >
                        {{ description }}
                    </v-alert>
                    <v-text-field
                        label="Code"
                        v-model="newCode"
                        outlined
                        required
                    ></v-text-field>
                    <quill-editor :options="quillOptions" v-model="newText" />
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn depressed @click="cancel">
                        <v-icon left>mdi-cancel</v-icon>
                        Cancel
                    </v-btn>
                    <v-btn depressed color="success" @click="save">
                        <v-icon left>mdi-check</v-icon>
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import { quillEditor } from "vue-quill-editor";

import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("content");

export default {
    components: {
        quillEditor
    },
    data() {
        return {
            loading: false,
            dialog: false,
            id: "",
            description: "",
            newCode: "",
            newText: "",
            quillOptions: {
                modules: {
                    toolbar: [
                        ["bold", "italic", "underline", "strike"],
                        ["blockquote"][{ header: [2, 3, 4, 5, false] }],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ indent: "-1" }, { indent: "+1" }],
                        [{ color: [] }, { background: [] }],
                        ["link"],
                        ["clean"]
                    ]
                }
            }
        };
    },
    computed: {
        ...mapGetters(["content", "active"])
    },
    methods: {
        edit(value) {
            this.$store.commit("content/setActive", value);
            this.id = this.active._id;
            this.newCode = this.active.code;
            this.newText = this.active.text;
            this.dialog = true;
        },
        cancel() {
            this.$store.commit("content/setActive", "");
            this.dialog = false;
        },
        async save() {
            this.loading = true;
            await this.$store.dispatch("content/save", {
                _id: this.id,
                code: this.newCode,
                text: this.newText
            });
            this.loading = false;
            this.dialog = false;
            this.$toast.success(`Content ${this.id ? "saved" : "added"}`);
        }
    },
    async created() {
        this.$store.dispatch("loading", true);
        await this.$store.dispatch("content/load");
        if (this.active && this.active.code) {
            this.edit(this.active.code);
        }
        this.$store.dispatch("loading", false);
    },
    updated() {
        if (!this.$refs.preview) {
            return;
        }
        for (let preview of this.$refs.preview) {
            let offsetHeight = preview.offsetHeight,
                scrollHeight = preview.scrollHeight;
            if (scrollHeight > offsetHeight) {
                preview.classList.add("trimmed");
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.v-card {
    position: relative;

    .btn-edit {
        position: absolute;
        right: 10px;
        bottom: 10px;
    }

    .preview {
        max-height: 100px;
        overflow: hidden;
        position: relative;

        &.trimmed::after {
            content: "";
            position: absolute;
            display: block;
            height: 50px;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(
                to top,
                rgba(255, 255, 255, 1),
                rgba(255, 255, 255, 0)
            );
        }
    }
}
</style>
