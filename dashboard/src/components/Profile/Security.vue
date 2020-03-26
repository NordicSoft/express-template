<template>
    <v-form ref="form" lazy-validation>
        <v-text-field
            v-model="password"
            prepend-icon="mdi-lock"
            type="password"
            :rules="passwordRules"
            label="Current Password"
            required
            autocomplete="off"
        ></v-text-field>
        <v-text-field
            v-model="newPassword"
            prepend-icon="mdi-lock"
            type="password"
            :rules="newPasswordRules"
            label="New Password"
            required
            autocomplete="off"
        ></v-text-field>
        <v-text-field
            v-model="newPasswordConfirm"
            prepend-icon="mdi-lock"
            type="password"
            :rules="newPasswordConfirmRules"
            label="New Password Confirmation"
            required
            autocomplete="off"
        ></v-text-field>
        <v-btn color="success" @click="save" class="mt-3">
            <v-icon class="mr-2">mdi-check</v-icon>
            Save
        </v-btn>
    </v-form>
</template>

<script>
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
    methods: {
        async save() {
            if (this.$refs.form.validate()) {
                let data = {
                    password: this.password,
                    newPassword: this.newPassword
                };

                await this.$http.post("/profile/change-password", data);

                this.$toast.success("Password changed");
            }
        }
    }
};
</script>
