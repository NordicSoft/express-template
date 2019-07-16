<template>
    <v-form ref="form" lazy-validation>
        <v-text-field
            v-model="password"
            prepend-icon="lock"
            type="password"
            :rules="passwordRules"
            label="Password"
            required
        ></v-text-field>
        <v-text-field
            v-model="passwordConfirm"
            prepend-icon="lock"
            type="password"
            :rules="passwordConfirmRules"
            label="Password Confirmation"
            required
        ></v-text-field>
        <v-btn color="success" @click="save">
            <v-icon class="mr-2">done</v-icon>Save
        </v-btn>
    </v-form>
</template>

<script>
import axios from "axios";

export default {
    data: () => ({
        password: "",
        passwordRules: [v => !!v || "Please provide your password"],
        passwordConfirm: ""
    }),
    computed: {
        passwordConfirmRules() {
            return [
                () =>
                    this.password === this.passwordConfirm ||
                    "Passwords does not match",
                v => !!v || "Please confirm your password"
            ];
        }
    },
    async mounted() {
        console.log("mounted");
    },
    methods: {
        save() {
            if (this.$refs.form.validate()) {
            }
        }
    }
};
</script>
