<template>
    <div>
        <v-app-bar
            dark
            color="primary"
            dense
            fixed
            :clipped-left="$vuetify.breakpoint.lgAndUp"
            app
            class="elevation-2"
        >
            <v-app-bar-nav-icon
                @click.stop="drawer = !drawer"
                class="mr-0"
            ></v-app-bar-nav-icon>
            <v-toolbar-title class="ml-0 pl-2">
                <v-btn text to="/" class="px-3">
                    <v-icon class="mr-2">mdi-view-dashboard</v-icon>
                    <span class="title">Dashboard</span>
                </v-btn>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
                icon
                :href="facadeUrl"
                target="_blank"
                v-if="$vuetify.breakpoint.xsOnly"
            >
                <v-icon>mdi-feature-search-outline</v-icon>
            </v-btn>
            <v-btn text :href="facadeUrl" target="_blank" v-else>
                <v-icon class="mr-2">mdi-feature-search-outline</v-icon>
                Facade
            </v-btn>
            <v-menu offset-y left>
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark v-on="on" icon>
                        <v-avatar color="teal lighten-5" size="36">
                            <v-icon dark>mdi-account-circle</v-icon>
                        </v-avatar>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item to="/profile" class="pr-10">
                        <v-list-item-icon>
                            <v-icon>mdi-account-box-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Profile</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="signOut" class="pr-10">
                        <v-list-item-icon>
                            <v-icon>mdi-exit-to-app</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Sign Out</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>
        <v-navigation-drawer
            v-model="drawer"
            fixed
            :clipped="$vuetify.breakpoint.mdAndUp"
            app
        >
            <v-subheader class="mt-2 grey--text text--darken-1">
                Administration
            </v-subheader>
            <v-list dense class="pa-0">
                <v-list-item to="/users" disabled>
                    <v-list-item-action>
                        <v-icon>mdi-account-group-outline</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Users</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item to="/content">
                    <v-list-item-action>
                        <v-icon>mdi-square-edit-outline</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Content</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item to="/gallery">
                    <v-list-item-action>
                        <v-icon>mdi-image-multiple</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Gallery</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item to="/files">
                    <v-list-item-action>
                        <v-icon>mdi-folder-multiple-outline</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Files</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <v-divider dark class="my-1"></v-divider>
            <v-subheader class="grey--text text--darken-1">Tools</v-subheader>
            <v-list dense class="pa-0">
                <v-list-item to="/send-email">
                    <v-list-item-action>
                        <v-icon>mdi-email-edit-outline</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Send Email</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item to="/google-maps">
                    <v-list-item-action>
                        <v-icon>mdi-google-maps</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Google Maps</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item to="/chat" disabled>
                    <v-list-item-action>
                        <v-icon>mdi-chat-outline</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Chat</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
export default {
    data: () => ({
        drawer: null,
        facadeUrl: process.env.VUE_APP_FACADE_URL
    }),
    methods: {
        async signOut() {
            await this.$store.dispatch("signOut");
            window.location = "/";
        }
    }
};
</script>

<style lang="scss" scoped>
.v-toolbar__title {
    font-size: 1.1rem !important;
}
</style>
