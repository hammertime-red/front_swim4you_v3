<template>
    <div class="">
        <template v-for="section in page.page_content" v-if="page?.page_content">
            <div v-if="section.type === 'intro_slider'" class="page_section">
                <BigSlider :items="section.data"/>
            </div>

            <div v-if="section.type === 'events_calendar'" class="page_section">
                <div class="container">
                    <div v-if="section.data.name" class="big_title">
                        <h2 class="section_title">{{ section.data.name }}</h2>
                    </div>
                </div>

                <HomeEventTabs :cards="section.data.cards" :navItems="section.data.nav"/>
            </div>

            <div v-if="section.type === 'results_timeline'" class="page_section" style="overflow: hidden;">
                <HomeTimelineCarousel :items="section.data.items" :name="section.data.name"/>
            </div>

            <div v-if="section.type === 'last_news'" class="page_section">
                <div class="container">
                    <div class="big_title flex flex-wrap justify-between items-center">
                        <h2 class="section_title mb-3 mb-md-0">{{ section.data.name }}</h2>
                        <Button as-child class="h-auto py-5 px-10 rounded-full" variant="outline">
                            <NuxtLink class="block" to="/news">Все новости</NuxtLink>
                        </Button>
                    </div>
                </div>
                <HomeNewsGrid :items="section.data.items"/>
            </div>

            <div v-if="section.type === 'last_media'" class="page_section">
                <div class="container">
                    <div class="grid md:grid-cols-2 gap-4">
                        <MediaBoxSlider v-if="section.data?.media_photo.length > 0"
                                        :items="section.data?.media_photo" :title="section.data?.photo_name || 'Фото'"
                                        :type="'photo'"/>
                        <MediaBoxSlider v-if="section.data?.media_video.length  > 0"
                                        :items="section.data?.media_video" :title="section.data?.video_name || 'Видео'"
                                        :type="'video'"/>
                    </div>
                </div>
            </div>

            <div v-if="section.type === 'description'" class="page_section">
                <div class="container">
                    <div class="formatted_content longtext_content" v-html="section.data?.content"/>
                </div>
            </div>

            <div v-if="section.type === 'partners'" class="page_section">
                <HomePartners :items="section.data?.items" :title="section.data?.name"/>
            </div>

        </template>
    </div>
</template>

<script setup>
import HomeNewsGrid from '../components/home/HomeNewsGrid.vue'
import HomePartners from '../components/home/HomePartners'
import HomeTimelineCarousel from '../components/home/HomeTimelineCarousel'
import HomeEventTabs from '../components/home/HomeEventTabs'
import BigSlider from "../components/home/BigSlider.vue";
import MediaBoxSlider from '@/components/MediaBoxSlider.vue';
import {useHomeStore} from "@/store/homeStore";
import {onMounted, ref} from "vue";
import {Button} from "~/components/shadcn/ui/button/index";

const homeStore = useHomeStore();
const loaded = ref(true);
const page = ref(null)

onMounted(async () => {
    page.value = await homeStore.fetchHome()
    loaded.value = true
})

</script>
