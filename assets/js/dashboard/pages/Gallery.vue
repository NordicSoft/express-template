<template>
    <div>
        <h1>Gallery</h1>
        <gallery />
    </div>
</template>

<script>
import Gallery from "./../components/Gallery";

export default {
    props: {
        initPhotoSet: { type: String, default: "all" }
    },
    components: {
        Gallery
    },
    data() {
        return {
            photoSet: this.initPhotoSet
        };
    },
    computed: {
        activePhotoSet(){
            return this.$store.getters["gallery/activePhotoSet"];
        }
    },
    watch:{
        activePhotoSet(photoSet){
            this.$router.push("/gallery/" + photoSet);
        }
    },
    created() {
        this.$store.commit("gallery/setActivePhotoSet", this.initPhotoSet);
    }
};
</script>

<style lang="scss" scoped>
</style>