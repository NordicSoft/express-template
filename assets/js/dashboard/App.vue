<template>
    <v-app class="dashboard">
        <Navbar />
        <v-content>
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </v-content>
        <v-overlay :value="$store.state.loading" color="white" opacity="0.7">
            <v-progress-circular indeterminate size="64" color="teal accent-1"></v-progress-circular>
        </v-overlay>
    </v-app>
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
    components: {
        Navbar
    }
};
</script>

<style lang="scss">
* {
    text-transform: initial;
}

.v-application.dashboard {
    background: #f7f7f7;
}

h1 {
    text-align: center;
    margin: 1rem auto 2rem;
}

.theme--light.v-text-field > .v-input__control > .v-input__slot:before {
    border-color: rgba(0, 0, 0, 0.1);
}
.theme--light.v-text-field:not(.v-input--has-state)
    > .v-input__control
    > .v-input__slot:hover:before {
    border-color: rgba(0, 0, 0, 0.25);
}
</style>

