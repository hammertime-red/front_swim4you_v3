<template>
<div v-if="item" class="media_box content_box">
    <div class="flex justify-between items-center">
        <p class="media_box__title">{{title}}</p>
    </div>
    <MediaCard :type="type" :class="'ratio_4x3'" :item="item"/>
</div>
</template>

<script>
import MediaCard from './cards/MediaCard'


export default {
    components: {
        MediaCard,
    },
    props: ['type', 'title', 'item'],
}
</script>

<style>

</style>
