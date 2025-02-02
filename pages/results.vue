<template>
    <div class="mt-12 mb-20">
        <RatingsTitle class="mb-12" />
        <div class="container">
            <div class="mb-5">
                <Form @submit="onSubmit" @reset="onClear" class="bg-gradient-to-r from-[#005EFF] to-[#071031] p-7 rounded-2xl">
                    <div class="grid grid-cols-12 gap-4">
                        <div v-if="filtersData?.meet_name" class="col-span-12 sm:col-span-6 lg:col-span-3">
                            <SelectField
                                    :options="filtersData.meet_name || []"
                                    name="meet_name"
                                    label="Мероприятие/Competition"
                                    label-class="text-white"
                                    nullable
                                    placeholder="Все"
                                    :initial-value="null"
                            />
                        </div>
                        <div v-if="filtersData?.year" class="col-span-12 sm:col-span-6 lg:col-span-3">
                            <SelectField
                                    :options="filtersData.year || []"
                                    name="year"
                                    label="Год/Year"
                                    label-class="text-white"
                                    nullable
                                    placeholder="Все"
                                    :initial-value="null"
                            />
                        </div>
                        <div class="col-span-12 lg:col-span-3 flex flex-wrap sm:flex-nowrap items-end gap-4">
                            <div class="flex gap-4 w-full">
                                <Button type="reset" variant="outline" size="icon" class="h-10 w-10 border-white text-white shrink-0 rounded-full">
                                    <Icon name="ri:refresh-line" />
                                </Button>
                                <Button type="submit" variant="accent" class="h-10 w-full uppercase rounded-full text-sm flex-grow">
                                    <span>Показать</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
           
            <div class="page_section">
                <div v-if="groupedEvents.length" class="container">
                    <template v-for="(year, i) in groupedEvents" :key="i">
                        <div class="record_category mb-6">
                            <h2 class="section_title_medium mb-3">{{ year.year }} год</h2>
        
                            <template v-for="(item, n) in year.items" :key="n">
                                <EventResultCard :item="item" />
                            </template>
                        </div>
                    </template>
                </div>
                <div v-if="!groupedEvents.length && eventsLoadStatus === 'success'" class="table__no_content text-center py-4 text-sub">
                    <img src="/img/table_no_content.svg" class="mx-auto max-w-[400px]">
                    <div class="font-oswald text-4xl">Не найдено результатов</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import PageAlertBox from '../components/PageAlertBox.vue'
import EventResultCard from '../components/cards/EventResultCard'
import {Button} from "~/components/shadcn/ui/button";
import SelectField from "~/components/UI/Fields/SelectField.vue";
import {Form} from 'vee-validate'
import RatingsTitle from "~/components/UI/RatingsTitle.vue";

const {data: eventsData, status: eventsLoadStatus} = useAsyncData(
    'event_results',
    async () => await fetchData('/event-results', {
        method: 'GET',
    }).catch(e => console.error(e))
)

const selectedMeet = ref(null)
const selectedYear = ref(null)

const groupedEvents = computed(() => {
    if(!eventsData.value) return []
    
    const filteredEvents = eventsData.value.filter(item => {
        return (!selectedMeet.value || selectedMeet.value === item.name) &&
            (!selectedYear.value || selectedYear.value === new Date(item.start_event_date).getFullYear())
    })
    
    const groups = filteredEvents.reduce((acc, event) => {
        const year = new Date(event.start_event_date).getFullYear()

        if (!acc[year]) {
            acc[year] = []
        }

        acc[year].push(event)
        return acc
    }, {})

    // Преобразуем в требуемый формат массива объектов
    return Object.entries(groups)
        .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA)) // Сортировка по убыванию
        .map(([year, items]) => ({
            year: Number(year),
            items
        }))
})

const filtersData = computed(() => {
    if(!eventsData.value){
        return {
            meet_name: [],
            year: [],
        }
    }
    return {
        meet_name: [...new Set(eventsData.value.map(event => event.name))]
            .sort()
            .map(name => ({
                label: name,
                value: name
            })),

        year: [...new Set(eventsData.value.map(event =>
            new Date(event.start_event_date).getFullYear()
        ))]
            .sort((a, b) => b - a)
            .map(year => ({
                label: String(year),
                value: year
            }))
    }
})

function onSubmit(values){
    selectedMeet.value = values.meet_name
    selectedYear.value = values.year
}

function onClear(){
    selectedMeet.value = null
    selectedYear.value = null
}

</script>
