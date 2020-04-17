<template>
    <div>
        <h1>Content</h1>
        <Content />
    </div>
</template>

<script>
import Content from "@/components/Content";

export default {
    props: {
        editContent: { type: String, default: "" }
    },
    components: {
        Content
    },
    data() {
        return {};
    },
    computed: {
        active() {
            let content = this.$store.getters["content/active"];
            return content ? content.code : "";
        }
    },
    watch: {
        active(content) {
            console.log(content);
            this.$router.push("/content/" + (content || "")).catch(() => {
                /* silent */
            });
        }
    },
    async created() {
        await this.$store.dispatch("content/load");
        this.$store.commit("content/setActive", this.editContent);
    }
};
</script>

<style lang="scss" scoped></style>
