<template>
    <photobank-layout>
        <template #content>
            <PhtPageIntro title="Поиск по изображениям" :founded_count="PHOTOS.length" class="mb-5" />
            <div class="container mb-5">
                <PhtMediaGrid :items="paginatedImages"/>

                <div v-if="!PHOTOS.length" class="no_photos text-center">
                    <h1 class="content_box__title fs-2">По вашему запросу ничего не найдено</h1>
                    <p class="text-sub">Попробуйте изменить поисковую фразу</p>
                </div>

                <button
                    v-if="showImages < PHOTOS.length"
                    @click="reFetchPhotos()"
                    class="show_more block btn btn-primary btn-primary-shadow rounded-pill mx-auto my-4">Показать еще</button>
            </div>

        </template>
        <template #offcanvas> </template>
    </photobank-layout>
</template>

<script>
import PhtMediaGrid from '~/components/photobank/PhtMediaGrid'
import PhotobankLayout from '../../layouts/PhotobankLayout.vue'
import PhtPageIntro from '@/components/photobank/PhtPageIntro.vue'
import {
    mapGetters, mapActions
} from "vuex";

export default {
    data(){
        return {
            limit: 20,
            showImages: 20,
        }
    },
    computed: {
        ...mapGetters({
            PHOTOS: "photobank/getPhotos"
        }),
        paginatedImages(){
            return this.PHOTOS.slice(0, this.showImages)
        },
    },
    watch: {
        '$route.query.s': {
            handler: function(s) {
                this.fetchPhotos(s)
            },
            deep: true,
            immediate: true
        }
    },
    async mounted(){
        setMeta(
            'Поиск по изображениям | Swim4you.ru',
            null,
            null,
            false
        )
        await this.fetchPhotos(this.$route.query.s)
    },
    methods: {
        ...mapActions({
            fetchPhotos: "photobank/fetchPhotos",
            reFetchPhotos: "photobank/reFetchPhotos"
        }),
    },
    components: {
        PhtMediaGrid,
        PhtPageIntro,
        PhotobankLayout
    }
}
</script>

<style scoped>
.show_more{
    min-width: 280px;
}
</style>
