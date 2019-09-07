<template>
    <div>
        <v-app-bar dark color="primary" dense fixed clipped-left app class="elevation-2">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="mr-0"></v-app-bar-nav-icon>
            <v-toolbar-title class="mr-5 ml-0">
                <v-btn text to="/">
                    <v-icon class="mr-2">mdi-view-dashboard</v-icon>
                    <span class="title">Dashboard</span>
                </v-btn>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn text to="/profile">
                <v-icon class="mr-2">mdi-account-box</v-icon>Profile
            </v-btn>
            <v-btn text href="/signout">
                <v-icon class="mr-2">mdi-exit-to-app</v-icon>Sign Out
            </v-btn>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" fixed clipped app>
            <v-subheader class="mt-3 grey--text text--darken-1">Administration</v-subheader>
            <v-list dense>
                <v-list-item to="/users" disabled>
                    <v-list-item-action>
                        <v-icon>mdi-account-group-outline</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Users</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider dark class="my-4"></v-divider>
                <v-subheader class="mt-3 grey--text text--darken-1">Tools</v-subheader>
                <v-list-item to="/send-email">
                    <v-list-item-action>
                        <v-icon>mdi-email-edit-outline</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Send Email</v-list-item-title>
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
                <v-list-item to="/gallery" disabled>
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
        </v-navigation-drawer>
    </div>
</template>

<script>
export default {
    data: () => ({
        drawer: null
    })
};
</script>

<style lang="scss">
</style>

