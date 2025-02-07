<template>
    <div class="mt-12 mb-20">
        <RatingsTitle class="mb-12"/>
        <div class="container mb-5">
            <Form class="bg-gradient-to-r from-[#005EFF] to-[#071031] p-7 rounded-2xl" @submit="onSubmit">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 sm:col-span-6 lg:col-span-3">
                        <SelectField
                                :initial-value="null"
                                :options="filtersData?.competition_name || []"
                                label="Соревнование/Competition"
                                label-class="text-white"
                                name="competition_name"
                                nullable
                                placeholder="Все"
                        />
                    </div>
                    <div v-if="filtersData?.year" class="col-span-12 sm:col-span-6 lg:col-span-2">
                        <SelectField
                                :initial-value="null"
                                :options="filtersData?.year || []"
                                label="Год/Year"
                                label-class="text-white"
                                name="year"
                                nullable
                                placeholder="Все"
                        />
                    </div>
                    <div v-if="filtersData?.stroke" class="col-span-12 sm:col-span-6 lg:col-span-2">
                        <SelectField
                                :initial-value="null"
                                :options="filtersData.stroke || []"
                                label="Стиль/Stroke"
                                label-class="text-white"
                                name="stroke"
                                nullable
                                placeholder="Все"
                        />
                    </div>
                    <div v-if="filtersData?.age_category" class="col-span-12 sm:col-span-6 lg:col-span-2">
                        <SelectField
                                :initial-value="null"
                                :options="filtersData.age_category || []"
                                label="Возрастная группа/Age group"
                                label-class="text-white"
                                name="age_category"
                                nullable
                                placeholder="Любой возраст"
                        />
                    </div>
                    <div class="col-span-12 lg:col-span-3 flex flex-wrap sm:flex-nowrap items-end gap-4">
                        <div class="flex gap-4 w-full">
                            <Button class="h-10 w-10 border-white text-white shrink-0 rounded-full" size="icon" type="reset" @click="resetFilters"
                                    variant="outline">
                                <Icon name="ri:refresh-line"/>
                            </Button>
                            <Button :disabled="eventsDataLoadingStatus !== 'success'" class="h-10 w-full uppercase rounded-full text-sm flex-grow" type="submit"
                                    variant="accent">
                                <span v-if="eventsDataLoadingStatus !== 'success'"><Icon
                                        name="svg-spinners:ring-resize"/></span>
                                <span v-else>Показать</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </Form>
        </div>
        <div v-if="eventsDataLoadingStatus === 'success'" class="page_section">
            <div v-if="groupedEvents.length" class="container">
                <div v-for="group in groupedEvents" class="record_category">
                    <h2 class="section_title_medium mb-3">{{ group.year }}</h2>
                    <TournamentCat v-for="(item, i) in group.items" :item="item"/>
                </div>
                <p class="small text-sub mt-5">
                    В случае, когда двое или более спортсменов в общем зачёте набирают равное
                    количество очков, победителем (либо занявшим более высокое место) признаётся
                    спортсмен, участвовавший и показавший лучший результат (лучшее количество очков
                    в данной категории) на последнем этапе. В случае если не один из данных
                    спортсменов не участвовал в последнем этапе, то победитель определяется
                    аналогично по результатам (участию), показанным на предыдущем этапе и т.д. Это
                    же правило действует при подведении промежуточных итогов. При равных
                    показателях и в этом случае, победитель определяется по лучшему результату
                    (очки FINA) показанному на последнем этапе.
                </p>
            </div>
            <PageAlertBox
                    v-else
                    :alert="{
						class: 'alert-warning',
						title: 'Записей по вашему запросу не найдено',
						text: 'Пожалуйста, попробуйте изменить критерии фильтрации',
					}"/>
        </div>
    </div>
</template>

<script setup>
import PageAlertBox from '../components/PageAlertBox.vue'
import TournamentCat from '../components/TournamentCat'
import SelectField from "~/components/UI/Fields/SelectField.vue";
import {Button} from "~/components/shadcn/ui/button";
import RatingsTitle from "~/components/UI/RatingsTitle.vue";
import {Form} from "vee-validate";

const filter = ref({
    year: null,
    competition_name: null,
    age_category: null,
    stroke: null,
})

const {data: eventsData, status: eventsDataLoadingStatus} = useAsyncData('tournaments', async () => {
    return await fetchData('tournament-tables', {
        method: 'GET',
    }).then(res => {
        return res.items
    }).catch(error => console.error(error))
})

const filtersData = computed(() => {
    if (!eventsData.value) return {
        year: [],
        competition_name: [],
        stroke: [],
        age_category: []
    }

    // Собираем уникальные значения
    const uniqueValues = eventsData.value.reduce((acc, event) => {
        // Года
        if (!acc.year.includes(event.year)) {
            acc.year.push(event.year)
        }

        // Названия соревнований
        if (!acc.competition_name.includes(event.competition_name)) {
            acc.competition_name.push(event.competition_name)
        }

        // Стили
        if (!acc.stroke.includes(event.stroke)) {
            acc.stroke.push(event.stroke)
        }

        // Возрастные категории
        if (!acc.age_category.includes(event.age_group)) {
            acc.age_category.push(event.age_group)
        }

        return acc
    }, {
        year: [],
        competition_name: [],
        stroke: [],
        age_category: []
    })

    // Преобразуем в формат label/value и сортируем
    return {
        year: uniqueValues.year
            .sort((a, b) => b - a)
            .map(year => ({ label: year.toString(), value: year })),

        competition_name: uniqueValues.competition_name
            .sort()
            .map(name => ({ label: name, value: name })),

        stroke: uniqueValues.stroke
            .sort()
            .map(stroke => ({ label: stroke, value: stroke })),

        age_category: uniqueValues.age_category
            .sort()
            .map(age => ({ label: age, value: age }))
    }
})

const filteredEvents = computed(() => {
    if (!eventsData.value) return []

    return eventsData.value.filter(event => {
        // Проверяем каждое условие фильтра
        if (filter.value.year && event.year !== filter.value.year) {
            return false
        }

        if (filter.value.competition_name && event.competition_name !== filter.value.competition_name) {
            return false
        }

        if (filter.value.age_category && event.age_group !== filter.value.age_category) {
            return false
        }

        if (filter.value.stroke && event.stroke !== filter.value.stroke) {
            return false
        }

        return true
    })
})

const groupedEvents = computed(() => {
    if (!filteredEvents.value) return []

    const groups = filteredEvents.value.reduce((acc, event) => {
        const year = event.year

        if (!acc[year]) {
            acc[year] = []
        }

        acc[year].push(event)
        return acc
    }, {})

    return Object.entries(groups)
        .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA)) // Сортировка по убыванию
        .map(([year, items]) => ({
            year: Number(year),
            items
        }))
})

function onSubmit(values) {
    filter.value = {
        year: values.year || null,
        competition_name: values.competition_name || null,
        age_category: values.age_category || null,
        stroke: values.stroke || null
    }
}

function resetFilters() {
    filter.value = {
        year: null,
        competition_name: null,
        age_category: null,
        stroke: null
    }
}

</script>

<style scoped>
.tournament_item__table .filter_box {
    border-radius: 0;
    background: #071031;
}
</style>
