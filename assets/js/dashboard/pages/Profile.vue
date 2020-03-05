<template>
    <div>
        <h1>Profile</h1>
        <v-card>
            <v-tabs
                v-model="tab"
                centered
                background-color="blue-grey lighten-5"
                @change="tabChanged"
            >
                <v-tab href="#general">
                    <v-icon class="mr-2">mdi-account</v-icon>General
                </v-tab>
                <v-tab href="#security">
                    <v-icon class="mr-2">mdi-lock</v-icon>Security
                </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
                <v-tab-item value="general">
                    <v-card flat>
                        <v-card-text>
                            <general />
                        </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item value="security">
                    <v-card flat>
                        <v-card-text>
                            <security />
                        </v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </v-card>
    </div>
</template>

<script>
import General from "./../components/Profile/General";
import Security from "./../components/Profile/Security";

export default {
    props: ["initTab"],
    data() {
        return {
            tab: this.initTab
        };
    },
    components: {
        General,
        Security
    },
    methods: {
        tabChanged(tab) {
            this.$router.push("/profile/" + tab).catch(() => { /* silent */ });
        }
    }
};
</script>