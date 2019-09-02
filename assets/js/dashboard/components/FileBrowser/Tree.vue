<template>
    <v-card flat tile width="250" min-height="300" class="d-flex flex-column folders-tree-card">
        <div class="grow scroll-x">
            <v-treeview
                :open="open"
                :active="active"
                :items="items"
                :search="filter"
                :load-children="readFolder"
                v-on:update:active="activeChanged"
                item-key="path"
                item-text="basename"
                dense
                activatable
                transition
                class="folders-tree"
            >
                <template v-slot:prepend="{ item, open }">
                    <v-icon
                        v-if="item.type === 'dir'"
                    >{{ open ? 'mdi-folder-open-outline' : 'mdi-folder-outline' }}</v-icon>
                    <v-icon v-else>{{ icons[item.extension] }}</v-icon>
                </template>
            </v-treeview>
        </div>
        <v-divider></v-divider>
        <v-toolbar dense flat class="shrink">
            <v-text-field
                solo
                flat
                hide-details
                label="Filter"
                v-model="filter"
                prepend-inner-icon="mdi-filter-outline"
                class="ml-n3"
            ></v-text-field>
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-btn icon @click="init" v-on="on">
                        <v-icon>mdi-collapse-all-outline</v-icon>
                    </v-btn>
                </template>
                <span>Collapse All</span>
            </v-tooltip>
        </v-toolbar>
    </v-card>
</template>

<script>
export default {
    props: {
        icons: Object,
        storage: String,
        path: String
    },
    data() {
        return {
            open: [],
            active: [],
            items: [],
            filter: ""
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
                        basename: "root",
                        extension: "",
                        name: "root",
                        children: []
                    }
                ];
            }, 0);
            if (this.path !== "") {
                this.$emit("path-changed", "");
            }
        },
        async readFolder(item) {
            this.$emit("loading", true);
            let response = await this.$http.get(
                "/storage/local/list?path=" + item.path
            );

            item.children.push(
                ...response.data.map(item => {
                    if (item.type === "dir") {
                        item.children = [];
                    }
                    return item;
                })
            );
            this.$emit("loading", false);
        },
        activeChanged(active) {
            console.log("FilesTree.activeChanged");
            console.log(active);
            this.active = active;
            let path = "";
            if (active.length) {
                path = active[0];
            }
            if (this.path != path) {
                this.$emit("path-changed", path);
            }
        }
    },
    watch: {
        storage() {
            console.log("watch storage");
            this.init();
        },
        path() {
            console.log("watch path");
            console.log(this.path);
            //this.activeChanged([this.path]);
            this.active = [this.path];
            if (!this.open.includes(this.path)) {
                this.open.push(this.path);
            }
        }
    },
    created() {
        this.init();
    }
};
</script>

<style lang="scss" scoped>
.folders-tree-card {
    height: 100%;

    .scroll-x {
        overflow-x: auto;
    }

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