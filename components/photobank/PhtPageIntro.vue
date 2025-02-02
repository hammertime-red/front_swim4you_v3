<template>
<div class="hero_intro text-white" :style="'background-image: url('+backgroundImg()+');'">
    <div class="container">
        <h1 v-if="title" class="intro_title_medium mb-3">{{title}}</h1>
        <PhtSearchForm v-if="$route.query.s || search_show" />
        <div class="flex justify-center items-center" v-else>
            <span v-if="founded_count" class="text-sub me-3">Найдено {{founded_count}} фото</span>
            <button @click="search_show = true" class="phtsearchform__tip text-sub text-sm p-1 rounded-3">
                <vue-feather type="search" size="14"/>
                Новый поиск
            </button>
        </div>
    </div>
</div>
</template>

<script>
import PhtSearchForm from './PhtSearchForm'
export default {
    props: ['title', 'founded_count'],
    data(){
        return {
            background: {
                desktop: '/assets/img/pht/pht_back_1.jpg',
                mobile: '/assets/img/pht/pht_back_1.jpg',
            },
            search_show: false,
        }
    },
    methods: {
        backgroundImg() {
            if (window.innerWidth < 768) {
                return this.background.mobile;
            } else {
                return this.background.desktop;
            }
        },
    },
    components: { PhtSearchForm },
}
</script>

<style scoped>
    .hero_intro{
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 80px 0;
    }

    .intro_title_medium{
        text-align: center;
        max-width: 850px;
        margin: 0 auto 30px;
    }

    @media(max-width: 768px){
        .breadcrumbs{
            display: none;
        }
    }

    .phtsearchform__tip{
        background: rgba(0, 0, 0, 0.35);
        border: none;
        transition: color .3s;
    }

    .phtsearchform__tip:hover{
        color: #fff !important;
    }
</style>
