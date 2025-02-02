<template>
    <photobank-layout>
        <template #content>
            <PhtPageIntro :title="ALBUM.name" :founded_count="ALBUM.items.length" class="mb-5" />
            <div class="container mb-5">
                <PhtMediaGrid :items="paginatedImages"/>

                <button
                    v-if="showImages < ALBUM.items.length"
                    @click="showImages += limit"
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
            ALBUM: "photobank/getAlbum"
        }),
        paginatedImages(){
            return this.ALBUM.items.slice(0, this.showImages)
        },
    },
    async mounted(){
        await this.fetchAlbum(this.$route.params.id)
        setMeta(
            this.ALBUM.name,
            null,
            this.ALBUM.thumbnail,
            false
        )
    },
    methods: {
        ...mapActions({
            fetchAlbum: "photobank/fetchAlbum"
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
