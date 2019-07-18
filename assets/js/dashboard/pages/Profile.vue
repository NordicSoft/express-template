<template>
    <div>
        <h1>Profile</h1>

        <v-tabs v-model="tab" centered color="blue-grey lighten-5" @change="tabChanged">
            <v-tab href="#general">
                <v-icon class="mr-2">person</v-icon>General
            </v-tab>
            <v-tab href="#security">
                <v-icon class="mr-2">lock</v-icon>Security
            </v-tab>

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
        </v-tabs>
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
            this.$router.push("/profile/" + tab);
        }
    }
};
</script>