<template>
<COffcanvas placement="top" :visible="getOffcanvas('search_box')" @hide="globalStore.closeOffcanvas('search_box')">
    <div class="offcanvas-body">
        <div class="container">
            <div class="search_box__input mb-3">
                <vue-feather type="search" />
                <input v-model="search_phrase" type="text" class="form-control rounded" placeholder="Введите запрос для поиска">
                <button @click="globalStore.closeOffcanvas('search_box')" type="button" class="btn-close text-reset"></button>
            </div>
            <div class="search_box__results">
                <template v-for="(cat, cat_name) in posts" :key="cat_name">
                    <div v-show="is_CatShow(cat)" class="search_box__results__section border-bottom p-3">
                        <p class="title font-bold">{{modelName(cat_name)}}</p>
                        <template v-for="(item, i) in cat" :key="i">
                            <NuxtLink v-if="is_show(item)" @click="globalStore.closeOffcanvas('search_box')" :to="modelLink(cat_name)+item.id" class="bg-body text-dark block p-2 mb-2 rounded-1">{{item.name}}</NuxtLink>
                        </template>
                    </div>
                </template>
            </div>
        </div>
    </div>
</COffcanvas>
<div></div>
</template>

<script>
import {
    COffcanvas
} from '@coreui/vue'
import {useGlobalStore} from '@/store/globalStore'
export default {
    data() {
        return {
            search_phrase: '',
            posts: []
        }
    },
    setup() {
        const globalStore = useGlobalStore();
        return {
            globalStore
        };
    },
    async mounted(){
        //await this.globalStore.fetchSearchIndex()
        this.posts = this.setIsShow()
    },
    computed: {
        getOffcanvas(){
            return this.globalStore.getOffcanvas
        },
        getSearchIndex(){
            return this.globalStore.getSearchIndex
        },
    },
    methods: {
        modelName(name){
            let true_name = name.split('__')[1]
            switch (true_name) {
                case 'EventMasterClass':
                    return 'Мастер-классы'
                case 'EventCamp':
                    return 'Сборы'
                case 'EventCompetition':
                    return 'Соревнования'
                case 'EventStage':
                    return 'Этапы соревнований'
                case 'Post':
                    return 'Новости'
                case 'Page':
                    return 'Страницы'
                case 'MediaPhoto':
                    return 'Фотоальбомы'
                case 'MediaVideo':
                    return 'Видеоальбомы'
                default:
                    return 'Страницы'
            }
        },
        modelLink(name){
            let true_name = name.split('__')[1]
            switch (true_name) {
                case 'EventMasterClass':
                    return '/events/'
                case 'EventCamp':
                    return '/events/'
                case 'EventCompetition':
                    return '/events/'
                case 'EventStage':
                    return '/stage/'
                case 'Post':
                    return '/news/'
                case 'Page':
                    return '/page/'
                case 'MediaPhoto':
                    return '/media/'
                case 'MediaVideo':
                    return '/media/'
                default:
                    return '/page/'
            }
        },
        setIsShow(){
            let posts = this.getSearchIndex
            for (let cat in posts){
                posts[cat].forEach(item => {
                    item.is_visible = false
                })
            }
            return posts
        },
        is_show(item) {
            if (this.search_phrase.length > 2 && item.name.toLowerCase().includes(this.search_phrase.toLowerCase())
            ){
                item.is_visible = true;
                return true
            } else {
                item.is_visible = false
                return false
            }
        },
        is_CatShow(cat){
            return cat.filter(item => {return item.is_visible}).length > 0
        }
    },
    components: {
        COffcanvas
    },
}
</script>

<style>
    .offcanvas-top{
        background: transparent;
        height: auto;
        bottom: auto;
        left: 50%;
        right: auto;
        width: 100%;
        max-width: 1280px;
        opacity: 0;
        transition: opacity 0.1s;
    }
    .offcanvas-top.show{
        transform: translateX(-50%) !important;
        opacity: 1;
    }
    .search_box__input{
        position: relative;
    }
    .search_box__input i{
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
    }
    .search_box__input button{
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
    }
    .search_box__input input{
        border: none;
        padding-left: 50px;
        height: 56px;
    }

    .search_box__results{
        background: #fff;
        border-radius: 10px;
    }

    .search_box__results__section:last-child{
        border: none !important;
    }
</style>
