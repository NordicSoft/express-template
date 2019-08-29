<template>
    <v-card class="mx-auto" :loading="loading">
        <v-toolbar flat dense color="blue-grey lighten-5">
            <v-toolbar-items>
                <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                        <v-btn text class="storage-select-button" v-on="on">
                            <v-icon class="mr-2">{{storage.icon}}</v-icon>
                            {{storage.name}}
                        </v-btn>
                    </template>
                    <v-list class="storage-select-list">
                        <v-list-item
                            v-for="(item, index) in storages"
                            :key="index"
                            :disabled="item.code === storage.code"
                            @click="changeStorage(item.code)"
                        >
                            <v-list-item-icon>
                                <v-icon v-text="item.icon"></v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>{{ item.name }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <template v-for="(segment, index) in pathSegments">
                    <v-icon :key="index + '-icon'">mdi-chevron-right</v-icon>
                    <v-btn
                        text
                        :input-value="index === pathSegments.length - 1"
                        :key="index + '-btn'"
                    >{{ segment }}</v-btn>
                </template>
            </v-toolbar-items>
            <div class="flex-grow-1"></div>

            <template v-if="$vuetify.breakpoint.smAndUp">
                <v-btn icon>
                    <v-icon>mdi-export-variant</v-icon>
                </v-btn>
                <v-btn icon>
                    <v-icon>mdi-delete-circle</v-icon>
                </v-btn>
                <v-btn icon>
                    <v-icon>mdi-plus-circle</v-icon>
                </v-btn>
            </template>
        </v-toolbar>

        <v-row no-gutters>
            <v-col md="auto">
                <v-card flat tile width="250" min-height="300" class="folders-tree-card">
                    <v-treeview
                        :active.sync="active"
                        :open.sync="open"
                        item-key="path"
                        return-object
                        dense
                        :items="items"
                        :load-children="readFolder"
                        activatable
                        transition
                        class="folders-tree"
                    >
                        <template v-slot:prepend="{ item, open }">
                            <v-icon
                                v-if="item.type === 'dir'"
                            >{{ open ? 'mdi-folder-open-outline' : 'mdi-folder-outline' }}</v-icon>
                            <v-icon v-else>{{ files[item.extension] }}</v-icon>
                        </template>
                    </v-treeview>
                </v-card>
            </v-col>

            <v-divider vertical></v-divider>

            <v-col>
                <v-scroll-y-transition mode="out-in">
                    <v-card flat tile>
                        <v-card-text
                            v-if="!path"
                            class="text-center grey--text"
                        >Select a folder or a file</v-card-text>
                        <v-card-text v-else>{{path}}</v-card-text>
                    </v-card>
                </v-scroll-y-transition>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>

export default {
    data() {
        return {
            loading: false,
            storage: null,
            storages: [
                {
                    name: "Local",
                    code: "local",
                    icon: "mdi-folder-multiple-outline"
                },
                { name: "Amazon S3", code: "s3", icon: "mdi-amazon-drive" }
            ],
            files: {
                html: "mdi-language-html5",
                js: "mdi-nodejs",
                json: "mdi-json",
                md: "mdi-markdown",
                pdf: "mdi-file-pdf",
                png: "mdi-file-image",
                txt: "mdi-file-document-outline",
                xls: "mdi-file-excel"
            },
            active: [],
            open: [],
            items: []
        };
    },
    computed: {
        path() {
            if (!this.active.length) {
                return "";
            }
            return this.active[0].path;
        },
        pathSegments() {
            return this.path.split("/").filter(item => item);
        },
        selected() {
            if (!this.active.length) return undefined;

            const path = this.active[0];

            return this.items.find(item => item.path === path);
        }
    },
    methods: {
        initFoldersTree() {
            this.items = [];
            this.open = [];
            this.active = [];
            // set default files tree items (root item) in nextTick.
            // Otherwise this.open isn't cleared properly (due to syncing perhaps)
            setTimeout(() => {
                this.items = [
                    {
                        type: "dir",
                        path: "/",
                        basename: "",
                        extension: "",
                        name: "root",
                        children: []
                    }
                ];
            }, 0);
        },
        changeStorage(code) {
            if (this.storage.code != code) {
                this.storage = this.storages.find(item => item.code == code);
                this.initFoldersTree();
            }
        },
        async readFolder(item) {
            this.loading = true;
            let response = await this.$http.get(
                "/storage/local/list?path=" + item.path
            );
            console.log(response.data);
            item.children = response.data;
            this.loading = false;
        }
    },
    created() {
        this.storage = this.storages[0];
        this.initFoldersTree();
    }
};
</script>

<style lang="scss" scoped>
/* Storage Menu - alternate appearance
.storage-select-button ::v-deep .v-btn__content {
    flex-wrap: wrap;
    font-size: 11px;

    .v-icon {
        width: 100%;
        font-size: 22px;
    }
}
*/

.storage-select-list .v-list-item--disabled {
    background-color: rgba(0, 0, 0, 0.25);
    color: #fff;

    .v-icon {
        color: #fff;
    }
}

::v-deep .folders-tree-card {
    overflow-x: auto;

    .folders-tree {
        width: fit-content;
        min-width: 250px;

        .v-treeview-node {
            cursor: pointer;

            &:hover {
                background-color: rgba(0, 0, 0, 0.025);
            }
        }
    }
}
</style>