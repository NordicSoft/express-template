<template>
    <v-card class="mx-auto" :loading="loading">
        <toolbar
            :path="path"
            :storages="storagesArray"
            :storage="activeStorage"
            v-on:storage-changed="storageChanged"
            v-on:path-changed="pathChanged"
        ></toolbar>
        <v-row no-gutters>
            <v-col sm="auto" class="d-none d-sm-flex">
                <files-tree :path="path" :storage="activeStorage" v-on:path-changed="pathChanged"></files-tree>
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

const availableStorages = [
    {
        name: "Local",
        code: "local",
        icon: "mdi-folder-multiple-outline"
    },
    {
        name: "Amazon S3",
        code: "s3",
        icon: "mdi-amazon-drive"
    }
];

export default {
    components: {
        Toolbar,
        FilesTree,
        FilesList
    },
    props: {
        // comma-separated list of active storage codes
        storages: { type: String, default: "local,s3" },
        // code of default storage
        storage: { type: String, default: "local" }
    },
    data() {
        return {
            loading: false,
            path: "",
            activeStorage: null
        };
    },
    computed: {
        storagesArray() {
            let storageCodes = this.storages.split(","),
                result = [];
            storageCodes.forEach(code => {
                result.push(availableStorages.find(item => item.code == code));
            });
            return result;
        }
    },
    methods: {
        storageChanged(storage) {
            console.log("FileBrowser.storageChanged: " + storage);
            this.activeStorage = storage;
        },
        pathChanged(path) {
            console.log("FileBrowser.pathChanged: " + path);
            this.path = path;
        }
    },
    created() {
        this.activeStorage = this.storage;
    }
};
</script>

<style lang="scss" scoped>
</style>