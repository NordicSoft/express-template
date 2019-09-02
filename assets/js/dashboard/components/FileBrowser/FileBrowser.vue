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
            <v-col sm="auto">
                <files-tree
                    :path="path"
                    :storage="activeStorage"
                    :icons="icons"
                    v-on:path-changed="pathChanged"
                    v-on:loading="loadingChanged"
                ></files-tree>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col>
                <files-list
                    :path="path"
                    :icons="icons"
                    v-on:path-changed="pathChanged"
                    v-on:loading="loadingChanged"
                ></files-list>
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

const fileIcons = {
    zip: "mdi-folder-zip-outline",
    rar: "mdi-folder-zip-outline",
    html: "mdi-language-html5",
    js: "mdi-nodejs",
    json: "mdi-json",
    md: "mdi-markdown",
    pdf: "mdi-file-pdf",
    png: "mdi-file-image",
    txt: "mdi-file-document-outline",
    xls: "mdi-file-excel"
};

export default {
    components: {
        Toolbar,
        FilesTree,
        FilesList
    },
    props: {
        // comma-separated list of active storage codes
        storages: {
            type: String,
            default: () => availableStorages.map(item => item.code).join(",")
        },
        // code of default storage
        storage: { type: String, default: "local" },
        icons: { type: Object, default: () => fileIcons }
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
        loadingChanged(loading) {
            console.log("FileBrowser.loadingChanged: " + loading);
            this.loading = loading;
        },
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