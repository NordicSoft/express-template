<template>
    <v-app class="dashboard">
        <Navbar />
        <v-content>
            <v-container fill-height>
                <v-layout justify-center>
                    <v-flex>
                        <router-view></router-view>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
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
</style>

