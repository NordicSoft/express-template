<template>
    <div>
        <h1>Send Email</h1>
        <v-card>
            <v-card-text>
                <v-form ref="form" lazy-validation>
                    <v-text-field
                        v-model="email"
                        label="E-Mail"
                        readonly
                    ></v-text-field>
                    <v-text-field
                        v-model="subject"
                        :rules="subjectRules"
                        label="Subject"
                        required
                    ></v-text-field>
                    <v-textarea
                        v-model="message"
                        :rules="messageRules"
                        label="Message"
                    ></v-textarea>
                    <v-btn color="success" @click="send">
                        <v-icon class="mr-2">mdi-check</v-icon>
                        Send
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
export default {
    data: () => ({
        email: "",
        subject: "",
        subjectRules: [v => !!v || "Please provide subject"],
        message: "",
        messageRules: [v => !!v || "Please provide message"]
    }),
    async mounted() {
        // load profile info
        let response = await this.$http.get("/profile"),
            profile = response.data;

        this.email = profile.email;
    },
    methods: {
        async send() {
            if (this.$refs.form.validate()) {
                let mail = {
                    subject: this.subject,
                    message: this.message
                };

                await this.$http.post("/send-email", mail);
                this.$toast.success("Email sent");
            }
        }
    }
};
</script>
