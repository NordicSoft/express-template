<template>
    <v-card flat tile>
        <v-card-text v-if="!path" class="text-center grey--text">Select a folder or a file</v-card-text>
        <v-card-text v-else>{{path}}</v-card-text>
    </v-card>
</template>

<script>
export default {
    props: {
        storage: String,
        path: String
    }
};
</script>

<style>
</style>