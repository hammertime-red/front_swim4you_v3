<template>
    <div class="searchbox_sm mb-4">
        <input
            v-model="search_input"
            type="text"
            class="form-control mt-0"
            placeholder="Поиск по новостям"
        />
        <button v-if="!search_mode" @click.prevent="search_mode = true" type="submit">
            <vue-feather type="search" class="small" />
        </button>
        <button
            v-else
            @click.prevent="search_mode = false, search_input = ''"
            type="submit"
        >
            <vue-feather type="x" class="small" />
        </button>
    </div>

    <div v-if="is_loaded" class="latest_news">
        <p class="title_block">{{ search_mode ? 'Поиск по новостям' : 'Последние новости'}}</p>

        <div
            v-for="(item, i) in show_posts"
            :key="i"
            class="latest_news__item flex content_box items-center p-1 mb-3"
        >
            <NuxtLink
                v-if="item.thumbnail"
                :to="'/news/' + item.id"
                class="latest_news__item__wrapper ratio ratio-1x1 me-2"
            >
                <div class="latest_news__img flex-shrink-0 ratio ratio-1x1 rounded">
                    <img :src="item.thumbnail" />
                </div>
            </NuxtLink>
            <div class="latest_news__desc" :class="!item.thumbnail ? 'p-3' : ''">
                <NuxtLink
                    :to="'/news/' + item.id"
                    class="latest_news__title"
                    >{{ item.name }}</NuxtLink
                >
                <p
                    v-if="item.date"
                    class="latest_news__date"
                >
                    <vue-feather type="calendar" size="12" />
                    {{ item.date }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import {
    mapGetters, mapActions
} from "vuex";
import moment from "moment";
export default {
    props: {
        current_post_id: {
            type: Number,
            default: null
        }
    },
    data(){
        return {
            search_input: '',
            search_downloaded: false,
            search_mode: false,
            is_loaded: false,
        }
    },
    async mounted() {
        await this.fetchPosts()
        this.is_loaded = true
    },
    methods: {
        ...mapActions({
            fetchPosts: "news/fetchPosts",
        }),
        created_date(date){
            return moment(date).format('DD-MM-YYYY');
        },
    },
    computed: {
        ...mapGetters({
            getPosts: "news/getPosts",
        }),
        show_posts(){
            if(this.search_mode) return this.searched_posts
            return this.related_posts
        },
        posts(){    
            let posts = this.getPosts.posts.sort((a, b) => {
                return moment(b.date, 'DD-MM-YYYY') - moment(a.date, 'DD-MM-YYYY');
            })

            if(this.current_post_id){
                let current_post_id = this.current_post_id
                posts = posts.filter(function(item) { 
                    return item.id !== current_post_id
                })
            }

            return posts
        },
        related_posts(){
            return this.posts.slice(0, 8)
        },
        searched_posts(){
            if(this.search_mode = true && this.posts.length){
                let results = this.posts.filter((item) => {
                    if(item.name.toLowerCase().includes(this.search_input.toLowerCase())) return true
                })
                return results.slice(0, 8)
            }
            return [];
        },
    }
};
</script>

<style scoped>
.latest_news__item__wrapper{
    max-width: 33%;
}

.latest_news__title{
    text-decoration: none;
    color: #071031;
}
</style>