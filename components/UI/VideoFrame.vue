<template>
    <div class="ratio ratio-21x9">
        <div
            v-if="!video_is_active"
            class="video_box"
            :style="'background-image: url(http://img.youtube.com/vi/' + youtubeId + '/maxresdefault.jpg)'"
        >
            <div class="overlay overlay_1"></div>
            <div class="overlay overlay_2"></div>
            <a
                @click.prevent="video_is_active = !video_is_active"
                href="#"
                class="btn btn-circle btn-circle--big text-primary"
            >
                <vue-feather type="youtube" size="36" />
            </a>
        </div>
        <iframe
            v-else
            width="100%"
            height="auto"
            :src="'https://www.youtube.com/embed/'+youtubeId"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
        ></iframe>
    </div>
</template>

<script>
export default {
    props: ['youtubeId'],
    data(){
        return {
            video_is_active: false
        }
    }
};
</script>

<style scoped>
    .btn-circle svg, .btn i{
        width: auto;
        height: auto;
    }
</style>