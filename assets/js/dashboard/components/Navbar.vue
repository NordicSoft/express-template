<template>
    <div>
        <v-navigation-drawer v-model="drawer" fixed clipped app>
            <v-subheader class="mt-3 grey--text text--darken-1">Administration</v-subheader>
            <v-list dense>
                <v-list-tile to="/users">
                    <v-list-tile-action>
                        <v-icon>supervisor_account</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Users</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar dark color="primary" dense fixed clipped-left app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title class="mr-5">
                <v-btn flat to="/">
                    <v-icon class="mr-2">dashboard</v-icon>
                    <span class="title">Dashboard</span>
                </v-btn>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn flat to="/profile">
                    <v-icon class="mr-2">account_box</v-icon>Profile
                </v-btn>
                <v-btn flat href="/signout">
                    <v-icon class="mr-2">exit_to_app</v-icon>Sign Out
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
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
.v-toolbar {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>

