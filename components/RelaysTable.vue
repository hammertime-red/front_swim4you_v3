<template>
    <div class="">
        <h2 class="font-oswald mb-4 text-4xl uppercase">Командные рейтинги</h2>
        <div class="content_box">
            <form @submit="onSubmit" class="bg-gradient-to-r from-[#005EFF] to-[#071031] p-7 rounded-t-2xl" ref="relaysForm">
                <div class="grid grid-cols-12 gap-4">
                    <div v-if="filtersData?.course" class="col-span-12 sm:col-span-6 lg:col-span-2">
                        <SelectField
                                :options="filtersData?.course || []"
                                name="course"
                                label="Бассейн/Pool"
                                label-class="text-white"
                                nullable
                                placeholder="Все"
                                :initial-value="null"
                        />
                    </div>
                    <div v-if="filtersData?.distance" class="col-span-12 sm:col-span-6 lg:col-span-2">
                        <SelectField
                                :options="filtersData.distance || []"
                                name="distance"
                                label="Дистанция/Event"
                                label-class="text-white"
                                nullable
                                placeholder="Все"
                                :initial-value="null"
                        />
                    </div>
                    <div v-if="filtersData?.stroke_name" class="col-span-12 sm:col-span-6 lg:col-span-2">
                        <SelectField
                                :options="filtersData.stroke_name || []"
                                name="stroke_name"
                                label="Стиль/Stroke"
                                label-class="text-white"
                                nullable
                                placeholder="Все"
                                :initial-value="null"
                        />
                    </div>
                    <div class="col-span-12 lg:col-span-4 flex flex-wrap sm:flex-nowrap items-end gap-4">
                        <div class="flex gap-4 w-full">
                            <Button type="reset" variant="outline" size="icon" class="h-10 w-10 border-white text-white shrink-0 rounded-full">
                                <Icon name="ri:refresh-line" />
                            </Button>
                            <Button type="submit" variant="accent" :disabled="statusTableData !== 'success'" class="h-10 w-full uppercase rounded-full text-sm flex-grow">
                                <span v-if="statusTableData !== 'success'"><Icon name="svg-spinners:ring-resize" /></span>
                                <span v-else>Показать</span>
                            </Button>
                        </div>
                        <Button
                                @click.prevent="isOpenFilters = !isOpenFilters"
                                type="button"
                                variant="outline"
                                class="h-10 w-full sm:w-fit ml-auto border-white text-white rounded-full text-sm"
                        >
                            <Icon :name="isOpenFilters ? 'ri:arrow-up-s-line' :'ri:arrow-down-s-line'" class="-ml-2" />
                            {{ isOpenFilters ? 'Скрыть' : 'Все фильтры' }}
                        </Button>
                    </div>
                </div>
                <Collapsible v-model:open="isOpenFilters">
                    <CollapsibleContent>
                        <div class="grid grid-cols-12 gap-4 mt-4">
                            <div v-if="filtersData?.athlete_age" class="col-span-12 sm:col-span-6 lg:col-span-3">
                                <SelectField
                                        :options="filtersData.athlete_age || []"
                                        name="age_from"
                                        label="Возраст от/Age from"
                                        label-class="text-white"
                                        nullable
                                        placeholder="Любой возраст"
                                        :initial-value="null"
                                />
                            </div>
                            <div v-if="filtersData?.athlete_age" class="col-span-12 sm:col-span-6 lg:col-span-3">
                                <SelectField
                                        :options="filtersData.athlete_age || []"
                                        name="age_to"
                                        label="Возраст до/Age till"
                                        label-class="text-white"
                                        nullable
                                        placeholder="Любой возраст"
                                        :initial-value="null"
                                />
                            </div>
                            <div v-if="filtersData?.session_year" class="col-span-12 sm:col-span-6 lg:col-span-3">
                                <SelectField
                                        :options="filtersData.session_year || []"
                                        name="session_year"
                                        label="Год/Year"
                                        label-class="text-white"
                                        nullable
                                        placeholder="Все"
                                        :initial-value="null"
                                />
                            </div>
                            <div v-if="filtersData?.club_code" class="col-span-12 sm:col-span-6 lg:col-span-3">
                                <SelectField
                                        :options="filtersData.club_code || []"
                                        name="club_code"
                                        label="Субъект/Region"
                                        label-class="text-white"
                                        nullable
                                        placeholder="Все"
                                        :initial-value="null"
                                />
                            </div>
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
                            <div class="col-span-12 sm:col-span-6 lg:col-span-3">
                                <DateField
                                        name="session_date_from"
                                        label="Период от/Period from"
                                        label-class="text-white"
                                        :initial-value="null"
                                />
                            </div>
                            <div class="col-span-12 sm:col-span-6 lg:col-span-3">
                                <DateField
                                        name="session_date_to"
                                        label="Период до/Period till"
                                        label-class="text-white"
                                        :initial-value="null"
                                />
                            </div>
                            <div class="col-span-12 sm:col-span-6 lg:col-span-3">
                                <TextField
                                        name="search"
                                        label="Поиск по названию/Search"
                                        label-class="text-white"
                                />
                            </div>
                            <div class="col-span-12">
                                <CheckboxField name="one_result" label="Только один результат для клуба" label-class="text-white flex items-center" />
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </form>
            <DataTable
                    stripedRows
                    :value="tableData"
                    size="lg"
                    paginator
                    :rows="pagination.per_page"
                    :total-records="totalRows"
                    :sortField="pagination.sort_by"
                    :sortOrder="pagination.sort_dir === 'asc' ? 1 : -1"
                    lazy
                    :loading="statusTableData !== 'success'"
                    @page="event => changePage(event)"
                    @sort="event => sortRows(event)"
            >
                <Column field="ranking_place" header="Место" sortable class="max-w-[70px]"></Column>
                <Column field="athlete_name" header="Команда" sortable>
                    <template #body="{data}">
                        <span class="text-sm font-bold">{{data.club_name}}</span>
                    </template>
                </Column>
                <Column field="club_code" header="Субъект" sortable>
                    <template #body="{data}">
                        <span class="text-sm">{{data.club_code}}</span>
                    </template>
                </Column>
                <Column field="formatted_swimtime" header="Время" sortable>
                    <template #body="{data}">
                        <span class="text-sm">{{formatSwimtime(data.formatted_swimtime)}}</span>
                    </template>
                </Column>
                <Column field="meet_name" header="Соревнование" sortable>
                    <template #body="{data}">
                        <span class="text-sm">{{data.meet_name}}</span>
                    </template>
                </Column>
                <Column field="city" header="Город" sortable>
                    <template #body="{data}">
                        <span class="text-sm">{{data.city}}</span>
                    </template>
                </Column>
                <Column field="formatted_session_date" header="Дата" sortable>
                    <template #body="{data}">
                        <span class="text-sm">{{formatTimestamp(data.formatted_session_date, 'dd.MM.yyyy')}}</span>
                    </template>
                </Column>
                <template #empty>
                    <div v-if="statusTableData !== 'success'" class="table__no_content text-center fs-3 py-3 text-sub">
                        <div>Загрузка данных</div>
                    </div>
                    <div v-else class="table__no_content text-center py-4 text-sub">
                        <img src="/img/table_no_content.svg" class="mx-auto">
                        <div class="font-oswald text-4xl">Не найдено результатов</div>
                    </div>
                </template>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import Avatar from '../components/UI/Avatar'
import SelectField from "~/components/UI/Fields/SelectField.vue";
import {useForm, Form} from "vee-validate";
import {Button} from "~/components/shadcn/ui/button";
import {Collapsible, CollapsibleContent} from "~/components/shadcn/ui/collapsible";
import DateField from "~/components/UI/Fields/DateField.vue";
import TextField from "~/components/UI/Fields/TextField.vue";
import CheckboxField from "~/components/UI/Fields/CheckboxField.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

definePageMeta({
    name: 'ratings'
})

const isOpenFilters = ref(false)
const initialValues = {
    distance_type: 'relay',
    search_for: 'club_name',
    ranking_place_min: 1,
}

const pagination = ref({
    sort_by: 'formatted_swimtime',
    sort_dir: 'asc',
    page: 1,
    per_page: 20,
})

const totalRows = ref(0)
const relaysForm = ref(null)

const {values, meta, setValues, handleSubmit} = useForm({
    initialValues: {
        ...initialValues // если нужны начальные значения
    }
})
const {data: filtersData} = useAsyncData('ratings_filters', async () => {
    return await fetchData('results/filters', {
        method: 'GET',
    }).catch(error => console.error(error))
})

const {data: tableData, refresh: refreshTableData, status: statusTableData} = useAsyncData('ratings_relays', () => getResults())

function changePage(event) {
    pagination.value.page = event.page + 1
    refreshTableData()
    scrollToForm()
}

function sortRows(event){
    pagination.value.sort_by = event?.sortField ?? null
    pagination.value.sort_dir = event.sortOrder === 1 ? 'asc' : 'desc';
    refreshTableData()
}

async function getResults(){
    const request = {...values}
    if(request.one_result){
        request.one_result_by = 'club_name'
    } else {
        request.one_result_by = 'formatted_swimtime'
    }

    return await fetchData('results', {
        method: 'GET',
        query: {
            ...pagination.value,
            ...initialValues,
            ...request,
        }
    })
        .then(data => {
            totalRows.value = data.total
            return data.results
        })
        .catch(error => console.error(error))
}

const onSubmit = handleSubmit(() => {
    refreshTableData()
})

const scrollToForm = () => {
    relaysForm.value.$el.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    })
}
</script>
