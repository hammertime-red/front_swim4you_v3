<template>

    <div v-if="items && items[selected]" class="post_video__content mb-5">
        <VideoFrame :youtubeId="items[selected].id" :class="'mb-2'"/>
        <h2 v-if="items[selected].name" class="text_20 font-bold mb-0">{{items[selected].name}}</h2>
    </div>

    <div class="post_video__grid">
        <div class="row g-4">
            <div
                v-for="(item, i) in items"
                :key="i"
                class="col-6 col-md-4 col-lg-3"
            >
                <div class="media__image rounded mb-2">
                    <div class="img_wrapper ratio ratio-16x9">
                        <img :src="'http://img.youtube.com/vi/' + item.id + '/maxresdefault.jpg'" />
                    </div>
                    <span @click="selected = i" class="media_badge">
                        <vue-feather type="youtube" />
                    </span>
                </div>
                <h3 v-if="item.name" class="fs-6 font-bold mb-0">{{item.name}}</h3>
            </div>
        </div>
    </div>

</template>

<script>
import VideoFrame from './UI/VideoFrame'
export default {
    components: { VideoFrame },
    props: ['items'],
    data(){
        return {
            selected: 1
        }
    },
};
</script>

<style>
</style>