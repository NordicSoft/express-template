<template>
    <v-card flat tile width="250" min-height="300" class="folders-tree-card">
        <v-treeview
            :open="open"
            :items="items"
            :load-children="readFolder"
            v-on:update:active="activeChanged"
            item-key="path"
            return-object
            dense
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
</template>

<script>
export default {
    props: {
        storage: String,
        path: String
    },
    data() {
        return {
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
            open: [],
            items: []
        };
    },
    methods: {
        init() {
            this.open = [];
            this.items = [];
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
        async readFolder(item) {
            let response = await this.$http.get(
                "/storage/local/list?path=" + item.path
            );

            item.children = response.data.map(item => {
                if (item.type === "dir") {
                    item.children = [];
                }
                return item;
            });
        },
        activeChanged(active) {
            let path = "";
            if (active.length) {
                path = active[0].path;
            }
            this.$emit("path-changed", path);
        }
    },
    watch: {
        storage() {
            this.init();
        }
    },
    created() {
        this.init();
    }
};
</script>

<style lang="scss" scoped>
.folders-tree-card {
    overflow-x: auto;

    ::v-deep .folders-tree {
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