<template>
<div v-if="text" class="longtext_box">
    <div v-html="text" class="longtext_content col-count-2">
    </div>
</div>
</template>

<script>
export default {
    props: ['text'],
}
</script>

<style>

</style>
