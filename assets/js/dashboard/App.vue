<template>
    <v-app id="express-template">
        <Navbar/>
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
.app {
    padding: 10px;
    background: #eee;

    .alert {
        margin: 10px;
    }
}
</style>

