<template>
    <v-toolbar flat dense color="blue-grey lighten-5">
        <v-toolbar-items>
            <v-menu offset-y v-if="storages.length > 1">
                <template v-slot:activator="{ on }">
                    <v-btn icon class="storage-select-button mr-3" v-on="on">
                        <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
                    </v-btn>
                </template>
                <v-list class="storage-select-list">
                    <v-list-item
                        v-for="(item, index) in storages"
                        :key="index"
                        :disabled="item.code === storageObject.code"
                        @click="changeStorage(item.code)"
                    >
                        <v-list-item-icon>
                            <v-icon v-text="item.icon"></v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-btn text @click="changePath('/')">
                <v-icon class="mr-2">{{storageObject.icon}}</v-icon>
                {{storageObject.name}}
            </v-btn>
            <template v-for="(segment, index) in pathSegments">
                <v-icon :key="index + '-icon'">mdi-chevron-right</v-icon>
                <v-btn
                    text
                    :input-value="index === pathSegments.length - 1"
                    :key="index + '-btn'"
                    @click="changePath(segment.path)"
                >{{ segment.name }}</v-btn>
            </template>
        </v-toolbar-items>
        <div class="flex-grow-1"></div>

        <template v-if="$vuetify.breakpoint.smAndUp">
            <v-btn icon>
                <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
        </template>
    </v-toolbar>
</template>

<script>
export default {
    props: {
        storages: Array,
        storage: String,
        path: String
    },
    computed: {
        pathSegments() {
            let path = "/",
                isFolder = this.path[this.path.length - 1] === "/",
                segments = this.path.split("/").filter(item => item);

            segments = segments.map((item, index) => {
                path +=
                    item + (index < segments.length - 1 || isFolder ? "/" : "");
                return {
                    name: item,
                    path
                };
            });

            return segments;
        },
        storageObject() {
            return this.storages.find(item => item.code == this.storage);
        }
    },
    methods: {
        changeStorage(code) {
            if (this.storage != code) {
                this.$emit("storage-changed", code);
                this.$emit("path-changed", "");
            }
        },
        changePath(path) {
            console.log("Toolbar.changePath: " + path);
            this.$emit("path-changed", path);
        }
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
</style>