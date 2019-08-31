<template>
    <div>
        <h1>Files</h1>
        <file-browser storages="local"/>
    </div>
</template>

<script>
import FileBrowser from "./../components/FileBrowser";

export default {
    components: {
        FileBrowser
    }
};
</script>