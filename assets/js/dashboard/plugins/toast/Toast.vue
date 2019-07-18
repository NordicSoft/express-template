<template>
    <v-snackbar
        v-model="active"
        :color="color"
        :top="top"
        :right="right"
        :bottom="bottom"
        :left="left"
        :timeout="timeout"
        :auto-height="autoHeight"
        :multi-line="multiLine"
        :vertical="vertical"
        @click="closeOnClick ? active = false : null"
    >
        <v-icon v-if="icon" dark left class="ml-0 mr-3">{{ icon }}</v-icon>
        <div v-html="message" class="toast-message"></div>
        <v-btn v-if="closeButton" flat icon @click="active = false" class="mr-0 ml-1">
            <v-icon>close</v-icon>
        </v-btn>
    </v-snackbar>
</template>

<script>
export default {
    props: {
        top: String,
        right: String,
        bottom: String,
        left: String,
        color: String,
        icon: String,
        message: String,
        autoHeight: Boolean,
        multiLine: Boolean,
        vertical: Boolean,
        timeout: { type: Number, default: 5000 },
        closeButton: { type: Boolean, default: true },
        closeOnClick: { type: Boolean, default: true }
    },
    data() {
        return {
            active: false
        };
    },
    watch: {
        active(val) {
            !val && this.$emit("hidden");
        }
    },
    mounted() {
        this.active = true;
    }
};
</script>

<style>
.toast-message {
    flex-grow: 1;
}
</style>
