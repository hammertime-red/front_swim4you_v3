<template>
    <photobank-layout>
        <template #content>
            <PhtIntro />
            <CategoryTabs @changeCat="changeCat"/>
            <PhtAlbumsList :items="paginatedYears" :category="category" />
            <button
                v-if="showYears < ALBUMS.length"
                @click="showYears += limit"
                class="show_more block btn btn-primary btn-primary-shadow rounded-pill mx-auto my-4">Показать еще</button>
        </template>
        <template #offcanvas>
        </template>
    </photobank-layout>
</template>

<script>
import PhtAlbumsList from '~/components/photobank/PhtAlbumsList'
import CategoryTabs from '~/components/photobank/CategoryTabs'
import PhotobankLayout from '../../layouts/PhotobankLayout.vue'
import PhtIntro from '~/components/photobank/PhtIntro'
import {
    mapGetters, mapActions
} from "vuex";

export default {
    data() {
        return {
            showYears: 5,
            limit: 5,
            category: null,
        }
    },
    computed: {
        paginatedYears(){
            return this.ALBUMS.slice(0, this.showYears)
        },
        ...mapGetters({
            ALBUMS: "photobank/getAlbums",
        }),
    },
    async mounted(){
        setMeta(
            'Фотобанк соревнований по плаванию | Swim4you.ru',
            null,
            null,
            false
        )
        await this.fetchAlbums()
    },
    methods: {
        ...mapActions({
            fetchAlbums: "photobank/fetchAlbums",
            fetchPhotobankCategories: 'photobank/fetchPhotobankCategories'
        }),
        changeCat(name){
            this.category = name
        }
    },
    components: {
        PhtAlbumsList,
        CategoryTabs,
        PhtIntro,
        PhotobankLayout
    },
}
</script>

<style>
.show_more{
    min-width: 280px;
}
</style>
