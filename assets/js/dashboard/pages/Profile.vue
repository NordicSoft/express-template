<template>
    <div>
        <h1>Profile</h1>

        <v-tabs centered color="blue-grey lighten-5">
            <v-tab href="#tab-1">
                <v-icon class="mr-2">person</v-icon>
                General
            </v-tab>
            <v-tab href="#tab-2">
                <v-icon class="mr-2">lock</v-icon>
                Security
            </v-tab>

            <v-tab-item value="tab-1">
                <v-card flat>
                    <v-card-text>
                        <general />
                    </v-card-text>
                </v-card>
            </v-tab-item>

            <v-tab-item value="tab-2">
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
    components: {
        General,
        Security
    }
};
</script>