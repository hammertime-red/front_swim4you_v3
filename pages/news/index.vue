<template>
    <WithSidebarLayout :noreverse="true">
        <template #head>
            <page-title title="Новости" />
            <page-alert-box v-for="(item, i) in alerts" :key="i" :alert="item"/>
        </template>
        <template #content>
            <div v-if="post" class="post_item content_box">
                <div class="post_item__header" :class="post.thumbnail ? 'post_item__header__with_thumb' : ''">

                    <div v-if="post.thumbnail" class="img_wrapper ratio ratio-16x9">
                        <div v-if="post.date" class="card__date text-sm">
                            <vue-feather type="calendar" /> {{post.date}}
                        </div>

                        <img :src="post.thumbnail">
                    </div>

                    <div v-if="post.thumbnail" class="post_item__title_box flex flex-col justify-content-end items-start p-4 p-md-5" :class="post.thumbnail ? 'post_item__title_box__with_thumb' : ''">
                        <div class="post_item__title_box__overlay"></div>
                        <div v-if="post.category" class="badge bg-warning text-dark font-bold font-oswald uppercase mb-3 fs-5">
                            {{post.category}}
                        </div>
                        <h1 class="post_title font-bold fs-2 font-oswald text-white mb-0">{{post.name}}</h1>
                    </div>

                    <div v-else class="post_item__title_box">
                        <div v-if="post.date && !post.thumbnail" class="card__date card__date--relative text-sm mb-3">
                            <vue-feather type="calendar" /> {{post.date}}
                        </div>
                        <div v-if="post.category" class="badge bg-warning text-dark font-bold font-oswald uppercase mb-3 fs-5">{{post.category}}</div>
                        <h1 class="post_title font-bold fs-2 font-oswald">
                            {{post.name}}
                        </h1>
                    </div>

                </div>

                <div class="post_item__content p-4 longtext_content" v-html="post.content">
                </div>
                <div v-if="post.source" class="post_item__sources mt-4 p-4 pt-0">
                    <p class="small text-sub text-end">Источник:
                        {{post.source}}</p>
                </div>
            </div>

            <template v-if="post.prev_next">
                <PostPrevNextArrows
                    :link="'/news/'"
                    :prevId="post.prev_next.prev.id"
                    :prevName="post.prev_next.prev.name"
                    :nextId="post.prev_next.next.id"
                    :nextName="post.prev_next.next.name"
                />
            </template>

        </template>
        <template #sidebar>
            <SidebarNews v-if="post.id" :current_post_id="post.id" />
        </template>
    </WithSidebarLayout>
</template>

<script>
import SidebarNews from '../components/SidebarNews'
import PageAlertBox from '../components/PageAlertBox.vue'
import PostPrevNextArrows from '../components/PostPrevNextArrows'
import PageTitle from '../components/PageTitle'
import WithSidebarLayout from '../layouts/WithSidebarLayout'
import moment from "moment";

import {
    mapGetters, mapActions
} from "vuex";
export default {
    components: {
        SidebarNews,
        PostPrevNextArrows,
        PageTitle,
        WithSidebarLayout, PageAlertBox
    },
    data(){
        return {
            post: {},
            alerts: null,
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
            fetchPost: "news/fetchPost",
        }),
        created_date(date){
            return moment(date).format('DD-MM-YYYY');
        },
    },
    computed: {
        ...mapGetters({
            getPost: "news/getPost",
        }),
    }
}
</script>

<style>
</style>
