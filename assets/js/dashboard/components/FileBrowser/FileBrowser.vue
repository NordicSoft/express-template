<template>
    <v-card class="mx-auto" :loading="loading">
        <toolbar
            :path="path"
            :storages="storages"
            :storage="storage"
            v-on:storage-changed="storageChanged"
            v-on:path-changed="pathChanged"
        ></toolbar>
        <v-row no-gutters>
            <v-col sm="auto" class="d-none d-sm-flex">
                <files-tree :path="path" :storage="storage" v-on:path-changed="pathChanged"></files-tree>
            </v-col>

            <v-divider vertical></v-divider>

            <v-col>
                <v-scroll-y-transition mode="out-in">
                    <files-list :path="path"></files-list>
                </v-scroll-y-transition>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
import Toolbar from "./Toolbar";
import FilesTree from "./FilesTree";
import FilesList from "./FilesList";

export default {
    components: {
        Toolbar,
        FilesTree,
        FilesList
    },
    data() {
        return {
            loading: false,
            path: "",
            storage: "local",
            storages: [
                {
                    name: "Local",
                    code: "local",
                    icon: "mdi-folder-multiple-outline"
                },
                { name: "Amazon S3", code: "s3", icon: "mdi-amazon-drive" }
            ]
        };
    },
    methods: {
        storageChanged(storage) {
            console.log(storage);
            this.storage = storage;
        },
        pathChanged(path) {
            console.log(path);
            this.path = path;
        }
    }
};
</script>

<style lang="scss" scoped>
</style>