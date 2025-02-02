<template>
    <default-layout>
        <template #content>
            <page-intro :title="postData.name" :image="postData.hero_img" :image_sm="postData.mobile_hero_img" :breadcrumbs="breadcrumbs" :button_text=" status.name == 'registration_open' ? 'Подать заявку' : null" @btnClick="toForm" />
            <page-navbar :items="page_navbar" />

            <div v-if="status" class="page_section mt-5">
                <div class="container">
                    <div class="content_box p-4">
                        <div class="row gy-4">
                            <div class="col-md-6">
                                <div class="badge font-oswald text-white uppercase text-sm mb-3" :class="status.badge_class">{{status.text}}</div>

                                <div class="row g-2">
                                    <div v-if="postData.location_city || postData.location_address" class="col-md-4">
                                        <p class="text-sub mb-0">Место проведения:</p>
                                        <p class="mb-0">{{location}}</p>
                                    </div>
                                    <div v-if="postData.dates" class="col-md-4">
                                        <p class="text-sub mb-0">Даты:</p>
                                        <p class="mb-0">{{postData.dates}}</p>
                                    </div>
                                    <div v-if="status.dates" class="col-md-4">
                                        <p class="text-sub mb-0">Срок приема заявок:</p>
                                        <p class="mb-0 font-bold" :class="status.text_class">{{status.dates}}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="row g-4 justify-content-end">
                                    <div class="col-md-6" v-if="postData.media_photo || postData.media_video">
                                        <div class="file_box_sm p-3 bg-body rounded h-full flex flex-col justify-center">
                                            <p v-if="status.name == 'stage_complited'" class="mb-2">Фото и видео уже опубликованы</p>
                                            <a href="#media_section" class="btn btn-white btn-rounded btn-sm w-full">
                                                <vue-feather type="image" class="text-primary"></vue-feather>Фото и видео
                                            </a>
                                        </div>
                                    </div>
                                    <div class="col-md-6" v-if="postData.result_link || postData.final_protocol_link || postData.lenex_file">
                                        <div class="file_box_sm p-3 pb-0 bg-body rounded h-full flex flex-col justify-center">
                                            <p v-if="status.name == 'stage_complited'" class="mb-2">Результаты этапа уже опубликованы</p>
                                            <a v-if="postData.result_link" :href="postData.result_link" target="_blank" rel="nofollow" class="btn btn-white btn-rounded btn-sm w-full mb-3">
                                                <vue-feather type="list" class="text-primary"></vue-feather>Онлайн-результаты
                                            </a>
                                            <a v-if="postData.final_protocol_link" :href="postData.final_protocol_link" target="_blank" rel="nofollow" class="btn btn-white btn-rounded btn-sm w-full mb-3">
                                                <vue-feather type="file-text" class="text-primary"></vue-feather>Итоговый протокол
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="postData.description" class="page_section" id="description_section">
                <div class="container">
                    <PageLongText :text="postData.description" />
                </div>
            </div>

            <div v-if="postData.document_links && postData.document_links.length > 0" class="page_section" id="documents_section">
                <div class="container">
                    <p class="section_title mb-4">Документы</p>
                    <DocumentsRow :items="postData.document_links" />
                </div>
            </div>

            <div v-if="postData.timetable && postData.timetable.length > 0" class="page_section" id="timetable_section">
                <div class="container">
                    <p class="section_title mb-4">Расписание</p>
                    <TimetableRow :items="postData.timetable" />
                </div>
            </div>

            <div v-if="postData.location_name" class="page_section" id="location_section">
                <div class="container">
                    <p class="section_title mb-4">Место проведения</p>
                    <LocationInfo :coord="postData.location_coord" :name="postData.location_name" :desc="postData.location_desc" />
                </div>
            </div>

            <div v-if="postData.residences && postData.residences.length > 0" class="page_section" id="residences_section">
                <div class="container">
                    <p class="section_title mb-4">Проживание</p>
                    <div class="row">
                        <div v-for="(item, i) in postData.residences" :key="i" class="col-md-4">
                            <Residence :item="item"/>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="postData.media_photo || postData.media_video" class="page_section" id="media_section">
                <div class="container">
                    <p class="section_title mb-4">Медиа</p>
                    <div class="row">
                        <div class="col-md-6">
                            <MediaBox title="Фото" type="photo" :item="postData.media_photo" />
                        </div>
                        <div class="col-md-6">
                            <MediaBox title="Видео" type="video" :item="postData.media_video" />
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </default-layout>
</template>

<script setup>
import DocumentsRow from '~/components/UI/DocumentsRow'
import TimetableRow from '~/components/UI/TimetableRow'
import LocationInfo from '~/components/UI/LocationInfo'
import Residence from '~/components/UI/Residence'
import MediaBox from '~/components/MediaBox'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageIntro from '@/components/PageIntro.vue'
import PageNavbar from '@/components/PageNavbar.vue'
import PageLongText from '@/components/PageLongText'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import moment from 'moment'

definePageMeta({
    name: 'event'
})

const route = useRoute()
const router = useRouter()
const store = useStore()

const status = ref({
    name: "closed",
    text: "",
    dates: null,
    badge_class: "bg-warning text-dark",
    text_class: "text-accent",
})

const postData = computed(() => store.getters['events/getStagePost'])
const CURRENT_TIME = computed(() => store.getters['events/CURRENT_TIME'])

const breadcrumbs = computed(() => [
    {
        title: 'Мероприятия',
        link: '/events/'
    },
    {
        title: postData.value.parent_name,
        link: '/events/'+postData.value.event_id
    }
])

const page_navbar = computed(() => {
    const navbar = []

    if(postData.value.description) {
        navbar.push({
            id: 0,
            title: "Основная информация",
            link: "#description_desction"
        })
    }
    if(postData.value.document_links?.length > 0) {
        navbar.push({
            id: 1,
            title: "Документы",
            link: "#documents_section"
        })
    }
    if(postData.value.timetable?.length > 0) {
        navbar.push({
            id: 2,
            title: "Расписание",
            link: "#timetable_section"
        })
    }
    if(postData.value.location_name) {
        navbar.push({
            id: 3,
            title: "Место проведения",
            link: "#location_section"
        })
    }
    if(postData.value.residences?.length > 0) {
        navbar.push({
            id: 4,
            title: "Проживание",
            link: "#residences_section"
        })
    }
    if(postData.value.media_photo || postData.value.media_video) {
        navbar.push({
            id: 5,
            title: "Медиа",
            link: "#media_section"
        })
    }
    return navbar
})

const getStatus = () => {
    let start_registration = null;
    let end_registration = null;
    let start_event = null;
    let end_event = null;

    if (postData.value.start_registration_date && postData.value.end_registration_date) {
        start_registration = moment.tz(
            postData.value.start_registration_date,
            "DD-MM-YYYY hh:mm",
            'Europe/Moscow'
        );
        end_registration = moment.tz(
            postData.value.end_registration_date,
            "DD-MM-YYYY hh:mm",
            'Europe/Moscow'
        );
        status.value.dates = start_registration.format("DD.MM.YYYY") + " - " + end_registration.format("DD.MM.YYYY");
    } else {
        status.value.text = "Прием заявок пока закрыт";
        return;
    }

    if (CURRENT_TIME.value < end_registration) {
        if (CURRENT_TIME.value < start_registration) {
            status.value.text = "Прием заявок пока закрыт";
            status.value.name = "registration_closed_now";
            return;
        }
        status.value.text = "Прием заявок уже идет";
        status.value.name = "registration_open";
        status.value.badge_class = "bg-positive";
        status.value.text_class = "text-positive";
        return;
    }

    if (postData.value.start_event_date && postData.value.end_event_date) {
        start_event = moment(postData.value.start_event_date, "DD-MM-YYYY hh:mm");
        end_event = moment(postData.value.end_event_date, "DD-MM-YYYY hh:mm");
    } else {
        status.value.text = "Прием заявок окончен";
        status.value.dates = 'Окончился '+end_registration.format("DD.MM.YYYY");
        status.value.name = "registration_end";
        status.value.badge_class = "bg-destructive";
        status.value.text_class = "text-red-500";
        return;
    }

    if (CURRENT_TIME.value < end_event) {
        status.value.dates = 'Окончился '+end_registration.format("DD.MM.YYYY");
        if (CURRENT_TIME.value < start_event) {
            status.value.text = "Прием заявок окончен";
            status.value.name = "event_not_now";
            status.value.badge_class = "bg-destructive";
            status.value.text_class = "text-red-500";
            return;
        }
        status.value.text = "Этап уже идет";
        status.value.name = "stage_now";
        status.value.badge_class = "bg-positive";
        status.value.text_class = "text-positive";
        return;
    }

    status.value.text = "Этап завершен";
    status.value.dates = 'Окончился '+end_registration.format("DD.MM.YYYY");
    status.value.name = "stage_complited";
    status.value.badge_class = "bg-destructive";
    status.value.text_class = "text-red-500";
}

const setPost = async () => {
    await store.dispatch('events/fetchStage', route.params.slug)
    getStatus()
}

const toForm = () => {
    router.push({
        name: 'event_form',
        query: {
            id: postData.value.id,
            type: 'competition'
        }
    })
}

onMounted(setPost)

watch(() => route.name, (newName) => {
    if(newName === 'stage') {
        setPost()
    }
})

const location = computed(() => {
    const loc = []
    if(postData.value.location_city) loc.push(postData.value.location_city)
    if(postData.value.location_name) loc.push(postData.value.location_name)
    return loc.join(', ')
})
</script>

<style scoped>
.file_box_sm{
    min-height: 100px;
}
</style>
