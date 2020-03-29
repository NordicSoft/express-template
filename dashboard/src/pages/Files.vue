<template>
    <div>
        <h1>Files</h1>
        <file-browser
            :axios="$http"
            v-model="path"
            :maxUploadFileSize="5242880"
            :maxUploadFilesCount="5"
        />
        <div class="py-5 text-center">
            <strong>Selected path:</strong>
            <v-chip v-if="path" color="green" text-color="white">
                <v-icon left v-if="path[path.length - 1] === '/'">
                    mdi-folder
                </v-icon>
                <v-icon left v-else>mdi-file</v-icon>
                {{ path }}
            </v-chip>
            <v-chip v-else outlined><em>empty string</em></v-chip>
        </div>
    </div>
</template>

<script>
import FileBrowser from "vuetify-file-browser";

export default {
    components: {
        FileBrowser
    },
    data() {
        return {
            path: ""
        };
    }
};
</script>
