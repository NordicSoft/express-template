<template>
    <v-app class="dashboard">
        <v-content>
            <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="8" md="7" lg="5">
                        <v-card class="elevation-3">
                            <v-card-text class="pa-10">
                                <router-view></router-view>
                                <div class="text-center pt-7">
                                    <v-btn depressed small :href="facadeUrl">
                                        <v-icon left>
                                            mdi-feature-search-outline
                                        </v-icon>
                                        Back to Website
                                    </v-btn>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            facadeUrl: process.env.VUE_APP_FACADE_URL
        };
    }
};
</script>

<style lang="scss">
* {
    text-transform: initial;
}

.theme--light.v-application.dashboard {
    background: #f7f7f7;
}

.v-card {
    max-width: 500px !important;
    margin: 0 auto;
}
</style>
