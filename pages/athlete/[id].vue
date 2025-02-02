<template>
    <div class="mt-12 mb-20">
        <div class="container">
            <div class="flex items-center justify-between gap-7 my-12">
                <p class="text-4xl font-oswald uppercase">Профиль атлета</p>
                <AppBreadcrumbs class="hidden lg:block"/>
            </div>
            <div class="page_section">
                <div v-if="athlete" class="content_box p-4 py-5 lg:p-10 mb-12">
                    <div class="grid grid-cols-12 gap-5 items-center">
                        <div class="col-span-12 lg:col-span-2 flex lg:block justify-center">
                            <Avatar :name="athlete.short_name" :src="athlete.avatar" size="lg"/>
                        </div>
                        <div class="col-span-12 lg:col-span-9">
                            <h1 class="text-4xl font-bold mb-4 text-center lg:text-left">
                                {{ athlete.lastname }} <br/>
                                {{ athlete.firstname }}
                            </h1>
                            <div class="flex flex-wrap gap-6 justify-center lg:justify-start">
                                <div v-if="athlete.birthyear" class="w-fit lg:text-left text-center">
                                    <p class="label text-sub text-sm mb-0">Год рождения:</p>
                                    <p class="value font-bold mb-0">{{ athlete.birthyear }}</p>
                                </div>
                                <div v-if="athlete.nation" class="w-fit lg:text-left text-center">
                                    <p class="label text-sub text-sm mb-0">Гражданство:</p>
                                    <Nation :name="athlete.nation" text_class="font-bold"/>
                                </div>
                                <div v-if="athlete.gender" class="w-fit lg:text-left text-center">
                                    <p class="label text-sub text-sm mb-0">Пол:</p>
                                    <p class="value font-bold mb-0">
                                        {{ athlete.gender == 'F' ? 'Женский' : 'Мужской' }}
                                    </p>
                                </div>
                                <div v-if="athlete?.club?.club_code" class="w-fit lg:text-left text-center">
                                    <p class="label text-sub text-sm mb-0">Субъект:</p>
                                    <p class="value font-bold mb-0">{{ athlete.club.club_code }}</p>
                                </div>
                                <div v-if="athlete.category" class="w-fit lg:text-left text-center">
                                    <p class="label text-sub text-sm mb-0">Разряд:</p>
                                    <p class="value font-bold mb-0">{{ athlete.category }}</p>
                                </div>
                                <div v-if="athlete?.club?.club_name" class="w-fit lg:text-left text-center">
                                    <p class="label text-sub text-sm mb-0">Клуб:</p>
                                    <p class="value font-bold mb-0">{{ athlete.club.club_name }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section v-if="records && records.length" class="mb-12">
                    <h2 class="section_title_medium mb-3">Рекорды</h2>
                    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
                        <template v-for="(item, i) in records" :key="i">
                            <RecordCard :item="item"/>
                        </template>
                    </div>
                </section>

                <section v-if="results && results.length" class="mb-5">
                    <h2 class="section_title_medium mb-3">Результаты</h2>
                    <RatingTableAthlete :athlete-id="athlete?.id" :initial-results="results" :total="resultsTotal"/>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup>
import RatingTableAthlete from '../components/RatingTableAthlete.vue'
import RecordCard from '../components/cards/RecordCard.vue'
import Nation from '../components/UI/Nation.vue'
import Avatar from '../components/UI/Avatar.vue'
import AppBreadcrumbs from "~/components/layout/AppBreadcrumbs.vue";

definePageMeta({
    name: 'athlete',
    breadcrumb: 'Профиль атлета'
})

const route = useRoute()

const athlete = ref(null)
const results = ref([])
const records = ref([])

const resultsTotal = ref(0)

const {data: athleteData} = useAsyncData(
    `athlete_${route.params.id}`,
    async () => {
        return await fetchData(`athlete/${route.params.id}`, {
            method: 'GET',
        }).then(res => {
            if (res.athlete) {
                athlete.value = res.athlete
            }
            if (res.results?.results) {
                results.value = res.results.results
                resultsTotal.value = res.results.total
            }
            if (res.records) {
                records.value = res.records
            }
        }).catch(e => console.error(e))
    },
)

const { setSegments } = useBreadcrumbs()
setSegments([
    {
        name: 'Профиль атлета',
        path: null,
        current: true
    }
])
</script>
