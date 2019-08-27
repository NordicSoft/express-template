<template>
    <v-form ref="form" lazy-validation>
        <v-text-field
            v-model="name"
            prepend-icon="mdi-account"
            :counter="50"
            :rules="nameRules"
            label="Name"
            required
        ></v-text-field>
        <v-text-field
            v-model="email"
            prepend-icon="mdi-email"
            maxlength="254"
            :rules="emailRules"
            label="E-mail"
            required
        ></v-text-field>
        <v-btn color="success" @click="save">
            <v-icon class="mr-2">mdi-check</v-icon>Save
        </v-btn>
    </v-form>
</template>

<script>
import axios from "axios";

export default {
    data: () => ({
        name: "",
        nameRules: [
            v => !!v || "Please provide your name",
            v => (v && v.length <= 50) || "Name must be less than 50 characters"
        ],
        email: "",
        emailRules: [
            v => !!v || "Please provide your email",
            v => /.+@.+/.test(v) || "Please enter a valid email address"
        ]
    }),
    async mounted() {
        // load profile info
        let response = await axios.get("/api/profile"),
            profile = response.data;

        this.name = profile.name;
        this.email = profile.email;
    },
    methods: {
        async save() {
            if (this.$refs.form.validate()) {
                let profile = {
                    name: this.name,
                    email: this.email
                };

                await axios.post("/api/profile", profile);
                this.$toast.success("Profile saved");
            }
        }
    }
};
</script>
