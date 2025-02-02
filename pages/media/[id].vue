<template>
    <default-layout>
        <template #content>
            <page-title title="Медиа" />
            <div v-if="post" class="page_section">
                <div class="container">
                    <div class="post_media content_box p-4 mb-4">
                        <div class="post_media__header mb-3">
                            <div class="badge bg-warning font-oswald text-sm uppercase text-dark mb-3">{{post.type == 'video' ?'Видеогалерея' : 'Фотогалерея'}}
                            </div>
                            <p v-if="post.event_name" class="post_content__prefix uppercase text-sm text-sub mb-1">{{post.event_name}}</p>
                            <h1 class="font-oswald uppercase font-bold mb-2">{{post.name}}</h1>
                            <div v-if="post.date && dateStr" class="small text-sub"><vue-feather class="small_icon" type="calendar"></vue-feather > {{dateStr}}
                            </div>
                        </div>
                        <ImagesMasonryGrid v-if="post.type == 'photo'" :items="post.images" :key="media_key" />
                        <VideosGrid v-if="post.type == 'video'" :items="post.videos" :key="video_key" />
                    </div>

                    <template v-if="post.prev_next">
                        <PostPrevNextArrows
                            :link="'/media/'"
                            :prevId="post.prev_next.prev.id"
                            :prevName="post.prev_next.prev.name"
                            :nextId="post.prev_next.next.id"
                            :nextName="post.prev_next.next.name"
                            @changePage="media_key++, video_key++"
                        />
                    </template>

                </div>
            </div>
        </template>
    </default-layout>
</template>

<script>
import VideosGrid from '../components/VideosGrid'
import ImagesMasonryGrid from '../components/ImagesMasonryGrid.vue'
import PostPrevNextArrows from '../components/PostPrevNextArrows'
import PageTitle from '../components/PageTitle.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import moment from 'moment'

import 'moment/locale/ru'
import {
    mapGetters, mapActions
} from "vuex";
export default {
    components: {
        VideosGrid,
        PostPrevNextArrows,
        DefaultLayout,
        PageTitle, ImagesMasonryGrid
    },
    data(){
        return {
            post: {},
            media_key: 1,
            video_key: 1,
        }
    },
    async mounted() {
        await this.fetchPost(this.$route.params.id)
        this.post = this.getPost
        setMeta(
            this.post.seo_title,
            this.post.seo_description,
            this.post.thumbnail,
            this.post.seo_robots
        )
    },
    async updated(){
        await this.fetchPost(this.$route.params.id)
        this.post = this.getPost
    },
    methods: {
        ...mapActions({
            fetchPost: "media/fetchPost",
        }),
    },
    computed: {
        ...mapGetters({
            getPost: "media/getPost",
        }),
        dateStr(){
            if(!this.post && !this.post.date) return null
            moment.locale('ru')
            return moment(this.post.date, 'DD-MM-YYYY').format('DD MMMM YYYY')
        }
    }
}
</script>

<style scoped>
.media_image_item img{
    max-height: 300px;
}
</style>
