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

            <div v-if="postData.description" class="page_section" id="description_section">
                <div class="container">
                    <PageLongText :text="postData.description" />
                    <NuxtLink :to="{ name: 'event_form', query: {id: postData.id, type: 'master_class'} }" class="btn btn-primary btn-primary-shadow btn-rounded px-5 mt-4">Подать заявку</NuxtLink>
                </div>
            </div>

            <div v-if="postData.document_links && postData.document_links.length > 0" class="page_section" id="documents_section">
                <div class="container">
                    <p class="section_title mb-4">Документы</p>
                    <DocumentsRow :items="postData.document_links" />
                </div>
            </div>

            <div v-if="postData.timetable.length > 0" class="page_section" id="timetable_section">
                <div class="container">
                    <p class="section_title mb-4">Расписание</p>

                    <div v-for="(group, i) in postData.timetable" :key="i" class="mb-4">
                        <p class="font-oswald uppercase font-bold fs-3">{{group.name}}</p>
                        <TimetableRow :items="group.timetable_group" />
                    </div >

                </div>
            </div>

            <div v-if="postData.trainers.length > 0" class="page_section" id="trainers_section">
                <div class="container">
                    <p class="section_title mb-4">Тренеры</p>
                    <TrainersRow :items="postData.trainers" />
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
    </default-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ContactsBox from '~/components/UI/ContactsBox'
import TrainersRow from '~/components/UI/TrainersRow'
import TimetableRow from '~/components/UI/TimetableRow.vue'
import DocumentsRow from '~/components/UI/DocumentsRow.vue'
import VideoFrame from '~/components/UI/VideoFrame'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageIntro from '@/components/PageIntro.vue'
import PageNavbar from '@/components/PageNavbar.vue'
import PageLongText from '@/components/PageLongText'

definePageMeta({
    name: 'master_class'
})

const props = defineProps(['postData'])

const breadcrumbs = ref([
    {
        title: 'Мероприятия',
        link: '/events/'
    },
    {
        title: 'Мастер-классы',
        link: '/events/?cat=master_classes'
    }
])

const page_navbar = computed(() => {
    const navbar = []

    if(props.postData.description) {
        navbar.push({
            id: 0,
            title: "О мастер-классе",
            link: "#description_desction"
        })
    }

    if(props.postData.document_links?.length > 0) {
        navbar.push({
            id: 1,
            title: "Документы",
            link: "#documents_section"
        })
    }

    if(props.postData.timetable?.length > 0) {
        navbar.push({
            id: 2,
            title: "Расписание",
            link: "#timetable_section"
        })
    }

    if(props.postData.trainers.length > 0) {
        navbar.push({
            id: 3,
            title: "Тренеры",
            link: "#trainers_section"
        })
    }

    if(props.postData.contacts_address) {
        navbar.push({
            id: 4,
            title: "Контакты",
            link: "#location_section"
        })
    }

    return navbar
})
</script>

<style>

</style>
