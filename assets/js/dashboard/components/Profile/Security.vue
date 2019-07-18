<template>
    <v-form ref="form" lazy-validation>
        <v-text-field
            v-model="password"
            prepend-icon="lock"
            type="password"
            :rules="passwordRules"
            label="Current Password"
            required
        ></v-text-field>
        <v-text-field
            v-model="newPassword"
            prepend-icon="lock"
            type="password"
            :rules="newPasswordRules"
            label="New Password"
            required
        ></v-text-field>
        <v-text-field
            v-model="newPasswordConfirm"
            prepend-icon="lock"
            type="password"
            :rules="newPasswordConfirmRules"
            label="New Password Confirmation"
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
        passwordRules: [v => !!v || "Please provide your current password"],
        newPassword: "",
        newPasswordRules: [v => !!v || "Please provide your new password"],
        newPasswordConfirm: ""
    }),
    computed: {
        newPasswordConfirmRules() {
            return [
                v => !!v || "Please confirm your password",
                () =>
                    this.newPassword === this.newPasswordConfirm ||
                    "Passwords does not match"
            ];
        }
    },
    async mounted() {
        console.log("mounted");
    },
    methods: {
        async save() {
            if (this.$refs.form.validate()) {
                let data = {
                        password: this.password,
                        newPassword: this.newPassword
                    },
                    response = await axios.post("/api/change-password", data);

                this.$toast.success("Password changed");
            }
        }
    }
};
</script>
