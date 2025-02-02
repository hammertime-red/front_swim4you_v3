<template>
    <default-layout>
        <template #content>
            <page-intro :title="postData.name" :image="postData.hero_img" :image_sm="postData.mobile_hero_img" :breadcrumbs="breadcrumbs"/>
            <page-navbar :items="this.page_navbar" />

            <div v-if="postData.description" class="page_section mt-5" id="description">
                <div class="container">
                    <PageLongText :text="postData.description" />
                </div>
            </div>

            <div v-if="postData.stages.length" class="page_section mt-5" id="stages">
                <div class="container">
                    <div class="row g-4">
                        <div v-for="(stage, i) in postData.stages" :key="i" class="col-md-6">
                            <StageCard :stage="stage" />
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="postData.tournament_table && postData.show_tournament" class="page_section" id="tournament_table">
                <div class="container">
                    <p class="section_title mb-4">Турнирная таблица</p>
                    <div class="content_box">
                        <TournamentTable :data="postData.tournament_table" />
                        <p class="small text-sub p-4 pt-2">В случае, когда двое или более спортсменов в общем зачёте набирают равное количество очков, победителем (либо занявшим более высокое место) признаётся спортсмен, участвовавший и показавший лучший результат (лучшее количество очков в данной категории) на последнем этапе. В случае если не один из данных спортсменов не участвовал в последнем этапе, то победитель определяется аналогично по результатам (участию), показанным на предыдущем этапе и т.д. Это же правило действует при подведении промежуточных итогов. При равных показателях и в этом случае, победитель определяется по лучшему результату (очки FINA) показанному на последнем этапе.</p>
                    </div>
                </div>
            </div>

            <div v-if="postData.videos.length > 0 || postData.photos.length > 0" class="page_section" id="results">
                <div class="container">
                    <p class="section_title mb-4">Медиа</p>
                    <div class="row">
                        <div v-if="postData.videos.length > 0" class="col-md-6">
                            <MediaBoxSlider :title="'Видео'" :type="'video'" :items="postData.videos" />
                        </div>
                        <div v-if="postData.photos.length > 0" class="col-md-6">
                            <MediaBoxSlider :title="'Фото'" :type="'photo'" :items="postData.photos" />
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </default-layout>
</template>

<script>
import TournamentTable from '../components/table/TournamentTable'
import StageCard from '../components/cards/StageCard'
import PageLongText from '../components/PageLongText.vue'
import MediaBoxSlider from '../components/MediaBoxSlider.vue'
import FilterBlue from '../components/FilterBlue.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageIntro from '@/components/PageIntro.vue'
import PageNavbar from '@/components/PageNavbar.vue'

export default {
    props: ['postData'],

    data() {
        return {
            breadcrumbs: [{
                title: 'Мероприятия',
                link: '/events/'
            }],
        }
    },
    computed: {
        page_navbar(){
            let page_navbar = [];
            if(this.postData.description){
                page_navbar.push({
                    id: 0,
                    title: "Описание",
                    link: "#description"
                })
            }
            if(this.postData.stages.length){
                page_navbar.push({
                    id: 1,
                    title: "Этапы соревнования",
                    link: "#stages"
                })
            }
            if(this.postData.tournament_table){
                page_navbar.push({
                    id: 2,
                    title: "Турнирная таблица",
                    link: "#tournament_table"
                })
            }
            if(this.postData.videos.length > 0 || this.postData.photos.length > 0){
                page_navbar.push({
                    id: 4,
                    title: "Результаты",
                    link: "#results"
                })
            }
            return page_navbar
        }
    },
    components: {
        TournamentTable,
        StageCard,
        DefaultLayout,
        FilterBlue, MediaBoxSlider,
        PageIntro,
        PageNavbar, PageLongText
    },
}
</script>

<style>
</style>
