<template>
    <v-form @submit="submit" ref="form" v-model="valid">
        <div class="display-2 font-weight-light text-center mb-10">Sign In</div>
        <v-text-field
            v-model="username"
            :rules="usernameRules"
            prepend-icon="mdi-account"
            label="Username or Email"
            placeholder=" "
            type="text"
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
            class="mb-1"
        />
        <div class="text-center">
            <v-btn color="success" depressed x-large type="submit">
                <v-icon left>
                    mdi-account-check-outline
                </v-icon>
                Sign In
            </v-btn>
        </div>
        <div class="text-center py-5">
            Don't have an account?
            <router-link to="/register">Register</router-link>
        </div>
    </v-form>
</template>

<script>
export default {
    data() {
        return {
            valid: false,
            username: "",
            usernameRules: [
                v => !!v || "Please provide your username or email"
            ],
            password: "",
            passwordRules: [v => !!v || "Please provide your password"]
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
            await this.$http.post("/auth/signin", {
                username: this.username,
                password: this.password
            });
            // TODO: consider `return` query param
            window.location = process.env.BASE_URL.slice(0, -1);
        }
    }
};
</script>
