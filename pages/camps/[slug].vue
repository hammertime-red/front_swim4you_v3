<template>
    <default-layout>
        <template #content>
            <page-intro :title="postData.name" :image="postData.hero_img" :image_sm="postData.intro_img_sm" :breadcrumbs="breadcrumbs" />
            <page-navbar :items="page_navbar" />

            <div v-if="postData.video_link" class="page_section mt-5">
                <div class="container">
                    <VideoFrame :youtubeId="postData.video_link"/>
                </div>
            </div>

            <div v-if="postData.description" class="page_section" id="about">
                <div class="container">
                    <PageLongText :text="postData.description" />
                </div>
            </div>

            <div class="page_section" id="registration_steps_section">
                <div class="container">
                    <p class="section_title mb-4">Порядок записи</p>
                    <OrderSteps :items="postData.registration_order" />
                </div>
            </div>

            <div v-if="postData.trainers.length > 0" class="page_section" id="trainers">
                <div class="container">
                    <p class="section_title mb-4">Тренеры</p>
                    <TrainersRow :items="postData.trainers" />
                </div>
            </div>

            <div v-if="postData.days_timetable" class="page_section" id="schedule">
                <div class="container">
                    <div class="content_box p-4">
                        <p class="fs-3 font-oswald uppercase mb-4">Расписание</p>
                        <DaysSchedule :items="postData.days_timetable" />
                    </div>
                </div>
            </div>

            <div v-if="postData.shifts.length > 0" class="page_section" id="camps">
                <div class="container">
                    <p class="section_title mb-4">Выбрать смену</p>
                    <div class="row g-4 gy-sm-5">
                        <div v-for="(item, i) in postData.shifts" :key="i" class="col-md-6 col-lg-4 col-xl-3 pb-4 pb-md-3">
                            <CampShiftCard :item="item" :num="i" :eventId="postData.id" />
                        </div>
                    </div>
                    <p v-if="postData.shift_notes" class="small text-sub mb-0 mt-3">{{postData.shift_notes}}</p>
                </div>
            </div>

            <div v-if="postData.media_gallery && Object.keys(postData.media_gallery).length > 0" class="page_section" id="gallery">
                <div class="container">
                    <div class="content_box p-4">
                        <p class="fs-3 font-oswald uppercase mb-4">Фото и видео</p>
                        <ImagesMasonryGrid :items="postData.media_gallery" />
                    </div>
                </div>
            </div>

            <div v-if="postData.athlete_documents && Object.keys(postData.athlete_documents).length > 0" class="page_section" id="documents">
                <div class="container">
                    <p class="section_title mb-2">Документы</p>
                    <p class="text-sub text_20">На каждого участника сборов должен быть предоставлен следующий пакет документов:</p>
                    <div class="row g-4 mb-3">
                        <div v-for="(item, i) in postData.required_documents" :key="i" class="col-md-6">
                            <div class="doc_desc p-3">
                                <div class="flex justify-between">
                                    <p v-if="item.name" class="font-bold mb-2">{{item.name}}</p>
                                    <a v-if="item.url" class="mb-2 text-sub" :href="item.url" target="_blank">Образец</a>
                                </div>
                                <p v-if="item.desc" class="mb-0 opacity-50">{{item.desc}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-3 text-white font-bold text-center bg-warning w-full rounded">Документы предоставляются
                        администратору сборов в день приезда.</div>
                </div>
            </div>

            <div v-if="postData.contacts_address" class="page_section" id="location_section">
                <div class="container">
                    <ContactsBox
                        :address="postData.contacts_address"
                        :phones="postData.contacts_phones"
                        :emails="postData.contacts_emails"
                        :contacts_workhours="postData.contacts_workhours"
                        :socials="postData.contacts_socials"
                        :coord="postData.contacts_coord"
                    />
                </div>
            </div>
        </template>
        <template #offcanvas>
            <CampShiftOffcanvas />
        </template>
    </default-layout>
</template>

<script setup>
import { ref } from 'vue'

import CampShiftOffcanvas from '../components/offcanvases/CampShiftOffcanvas'
import CampShiftCard from '../components/cards/CampShiftCard'
import DaysSchedule from '../components/DaysSchedule'
import OrderSteps from '../components/OrderSteps'
import VideoFrame from '../components/UI/VideoFrame.vue'
import TrainersRow from '../components/UI/TrainersRow.vue'
import ContactsBox from '../components/UI/ContactsBox.vue'
import YandexMap from '../components/YandexMap'
import ImagesMasonryGrid from '../components/ImagesMasonryGrid.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageIntro from '@/components/PageIntro.vue'
import PageNavbar from '@/components/PageNavbar.vue'
import PageLongText from '@/components/PageLongText'

definePageMeta({
    name: 'camp'
})

const props = defineProps(['postData'])
const video_is_active = ref(false)

const breadcrumbs = ref([
    {
        title: 'Мепоприятия',
        link: '/events/'
    },
    {
        title: 'Сборы',
        link: '/events/?cat=camps'
    }
])

const page_navbar = ref([
    { id: 0, title: "О сборах", link: "#about" },
    { id: 1, title: "Порядок записи", link: "#order_order" },
    { id: 2, title: "Тренеры", link: "#trainers" },
    { id: 4, title: "Расписание", link: "#schedule" },
    { id: 5, title: "Выбрать смену", link: "#camps" },
    { id: 6, title: "Галерея", link: "#gallery" },
    { id: 7, title: "Документы", link: "#documents" },
    { id: 8, title: "Контакты", link: "#location_section" }
])
</script>

<style>

</style>
