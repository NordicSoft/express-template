<template>
    <v-form @submit="submit" ref="form" v-model="valid">
        <div class="display-2 font-weight-light text-center mb-10">
            Register
        </div>
        <v-text-field
            v-model="name"
            :rules="nameRules"
            prepend-icon="mdi-account-outline"
            label="Name"
            placeholder=" "
            type="text"
            maxlength="50"
            outlined
            required
            class="mb-3"
        />
        <v-text-field
            v-model="username"
            :rules="usernameRules"
            prepend-icon="mdi-account-star-outline"
            label="Username"
            placeholder=" "
            type="text"
            maxlength="30"
            outlined
            required
            class="mb-3"
        />
        <v-text-field
            v-model="email"
            :rules="emailRules"
            prepend-icon="mdi-email-outline"
            label="Email"
            placeholder=" "
            type="text"
            name="email"
            maxlength="254"
            outlined
            required
            class="mb-3"
        />
        <v-text-field
            v-model="password"
            :rules="passwordRules"
            prepend-icon="mdi-asterisk"
            label="Password"
            placeholder=" "
            type="password"
            maxlength="254"
            outlined
            required
            class="mb-3"
        />
        <v-text-field
            v-model="passwordConfirm"
            :rules="passwordConfirmRules"
            prepend-icon="mdi-asterisk"
            label="Confirm Password"
            placeholder=" "
            type="password"
            name="password"
            maxlength="254"
            outlined
            required
            class="mb-1"
        />
        <div class="text-center">
            <v-btn color="success" depressed x-large type="submit">
                <v-icon left>
                    mdi-account-plus-outline
                </v-icon>
                Register
            </v-btn>
        </div>
        <div class="text-center py-5">
            Already have an account?
            <router-link to="/">Sign In</router-link>
        </div>
    </v-form>
</template>

<script>
import { getQueryParam } from "@/util";

export default {
    data() {
        return {
            valid: false,
            name: "",
            nameRules: [v => !!v || "Please provide your name"],
            username: "",
            usernameRules: [
                v => !!v || "Please provide your username (login)",
                v => v.length >= 5 || "Minimal length is 5 characters",
                v =>
                    /^[a-z0-9_-]+$/.test(v) ||
                    "Allowed characters are a-z (lower case), 0-9, _ and -"
            ],
            email: "",
            emailRules: [
                v => !!v || "Please provide your email",
                v => /.+@.+/.test(v) || "Please enter a valid email address"
            ],
            password: "",
            passwordRules: [v => !!v || "Please provide your password"],
            passwordConfirm: "",
            passwordConfirmRules: [
                v => !!v || "Please confirm your password",
                v => v === this.password || "Passwords do not match"
            ]
        };
    },
    methods: {
        async submit(e) {
            e.preventDefault();
            this.$refs.form.validate();
            if (!this.valid) {
                this.$toast.warning("Please fix errors above");
                return;
            }
            await this.$http.post("/auth/register", {
                name: this.name,
                username: this.username,
                email: this.email,
                password: this.password,
                passwordConfirm: this.passwordConfirm
            });

            let returnUrl = getQueryParam("return");
            if (returnUrl) {
                window.location = returnUrl;
                return;
            }

            window.location = process.env.BASE_URL.slice(0, -1);
        }
    }
};
</script>
