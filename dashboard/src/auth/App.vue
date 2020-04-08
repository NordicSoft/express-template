<template>
    <v-app class="dashboard">
        <v-content>
            <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="8" md="7" lg="5">
                        <v-card class="elevation-3">
                            <v-card-text class="pa-10 pb-5">
                                <router-view></router-view>
                                <div class="text-center py-5 mx-n10 social">
                                    <v-btn
                                        outlined
                                        color="orange"
                                        @click="google"
                                    >
                                        <v-icon left>
                                            mdi-google
                                        </v-icon>
                                        Google
                                    </v-btn>
                                </div>
                                <div class="text-center pt-5">
                                    <v-btn text small :href="facadeUrl">
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
    },
    methods: {
        async google() {
            window.location = process.env.VUE_APP_API_BASE_URL + "/auth/google";
        }
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
    background: linear-gradient(
        35deg,
        rgba($color: #1cd8d2, $alpha: 0.2),
        rgba($color: #93edc7, $alpha: 0.1)
    );
}

.social {
    background: rgba($color: #fff, $alpha: 0.5);
}
</style>
