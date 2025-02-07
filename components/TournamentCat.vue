<template>
	<div class="event_results_links content_box mb-3">
        <Collapsible v-model:open="isExpanded">
            <div class="tournament_item__header p-4 px-6">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-9 flex items-center">
                        <img
                            v-if="item.competition_icon"
                            :src="item.competition_icon"
                            class="championship__logo me-2" />
                        <div>
                            <p class="text-sub text-sm mb-0">{{ item.competition_name }}</p>
                            <p class="font-bold text_20 mb-1">{{ itemName }}</p>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-3 flex lg:justify-end items-center">
                        <CollapsibleTrigger as-child>
                            <Button variant="secondary" class="rounded-full py-3 h-auto w-full md:w-fit">
                                <Icon :name="isExpanded ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'" />
                                <span>{{ isExpanded ? 'Свернуть' : 'Развернуть' }}</span>
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                </div>
            </div>
            <CollapsibleContent>
                <DataTable
                        stripedRows
                        :value="tableData"
                        size="lg"
                        paginator
                        :rows="10"
                        :total-records="tableData?.length || 0"
                        :sortField="pagination.sort_by"
                        :sortOrder="pagination.sort_dir"
                        :loading="statusTableData !== 'success'"
                        v-model:filters="filters"
                        :globalFilterFields="['athlete.name', 'club_code']"
                        class="tournamentTable"
                >
                    <template #header>
                        <div class="flex">
                            <div class="relative w-full items-center max-w-[360px]">
                                <Input v-model="filters['global'].value" type="text" placeholder="Поиск по атлету..." class="pl-8" />
                                <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                                    <Icon name="ri:search-2-line" class="size-5 text-sub" />
                                </span>
                            </div>
                        </div>
                    </template>

                    <ColumnGroup type="header">
                        <Row>
                            <!-- Первая строка заголовков -->
                            <Column header="Место" field="place" :rowspan="2" sortable />
                            <Column header="Спортсмен" field="athlete.name" :rowspan="2" sortable />
                            <Column header="Субъект" field="club_code"  :rowspan="2" sortable />

                            <!-- Группы колонок для каждого этапа -->
                            <Column v-for="group in headerGroups"
                                    :key="group.name"
                                    :header="group.name"
                                    :colspan="group.columns"
                                    :pt="{
                                        columnHeaderContent: { class: 'flex justify-center items-center' },
                                        columnTitle: { class: 'text-center' }
                                    }" />

                            <Column header="Итог" :rowspan="2" field="summ" sortable />
                        </Row>

                        <Row>
                            <!-- Подзаголовки для каждой дистанции -->
                            <Column v-for="col in dynamicColumns"
                                    :key="col.header"
                                    :header="col.header"
                                    :field="col.field"
                                    sortable
                            />
                        </Row>
                    </ColumnGroup>
                    
                    <Column field="place" header="Место" sortable class="max-w-[70px]">
                        <template #body="{data}">
                            <span class="text-sm">{{data.place}}</span>
                        </template>
                    </Column>
                    
                    <Column field="athlete.name" header="Спортсмен" sortable>
                        <template #body="{data}">
                            <NuxtLink :to="{name: 'athlete', params: {id: data.athlete.id}}" class="flex items-center text-main">
                                <img
                                        v-if="[1,2,3].includes(data?.place)"
                                        class="w-5 me-2"
                                        :src="`/img/medal_${data?.place}.svg`"
                                >
                                <Avatar :class="'me-2'" :name="data.athlete.name" :src="data.athlete.avatar"/>
                                <span
                                    class="font-bold text-sm"
                                    :class="{
                                        '!text-base': [1,2,3].includes(data?.place)
                                    }">
                                    {{ data.athlete.name }}
                                </span>
                            </NuxtLink>
                        </template>
                    </Column>
                    
                    <Column field="club_code" header="Субъект" sortable>
                        <template #body="{data}">
                            <span class="text-sm">{{data.club_code}}</span>
                        </template>
                    </Column>
                    
                    <Column v-for="col in dynamicColumns"
                            :key="col.header"
                            v-bind="col">
                        <template #body="{data}">
                            <span class="text-sm">{{ col.body(data) }}</span>
                        </template>
                    </Column>
                    
                    <Column field="summ" header="Итог" sortable>
                        <template #body="{data}">
                            <span class="text-sm">{{data.summ}}</span>
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
            </CollapsibleContent>
        </Collapsible>
	</div>
</template>

<script setup>
import {Button} from "~/components/shadcn/ui/button";
import {Collapsible, CollapsibleTrigger, CollapsibleContent} from "~/components/shadcn/ui/collapsible";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Avatar from "~/components/UI/Avatar.vue";
import { FilterMatchMode } from '@primevue/core/api';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import {Input} from "~/components/shadcn/ui/input";

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

const isExpanded = ref(false)
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const itemName = computed(() => {
    let name = ''
    if (props.item.distance_type === 'relay') {
        name += 'Командный зачет – '
    }
    name += props.item.style_name

    return name
})

const {data: tableData, refresh: refreshTableData, status: statusTableData} = useAsyncData(
    `tournament_table_${props.item.id}`,
    async () => {
        return await fetchData(`tournament-tables/${props.item.id}`, {
            method: 'GET',
        }).then(res => {
            return res
        }).catch(error => console.error(error))
    },
    {
        immediate: false
    }
)

const pagination = ref({
    sort_by: 'place',
    sort_dir: 1,
})


const dynamicColumns = computed(() => {
    if (!tableData.value?.[0]?.points) return []

    return tableData.value[0].points.reduce((acc, stage, stageIndex) => {
        const columns = stage.items.map((item, itemIndex) => ({
            field: `points.${stageIndex}.items.${itemIndex}.value`,
            header: item.label,
            sortable: true,
            class: 'text-center',
            body: (data) => {
                const value = data.points?.[stageIndex]?.items?.[itemIndex]?.value
                return value === null ? '-' : value
            }
        }))
        return [...acc, ...columns]
    }, [])
})

const headerGroups = computed(() => {
    if (!tableData.value?.[0]?.points) return []

    return tableData.value[0].points.map(stage => ({
        name: stage.name,
        columns: stage.items.length
    }))
})

watch(isExpanded, async () => {
    if(!tableData.value){
        await refreshTableData()
    }
})
</script>

<style lang="scss">
.tournamentTable.p-datatable {
  .p-datatable-header{
    padding-top: 0px !important;
  }
  
  thead.p-datatable-thead th {
    border: 1px solid #fff !important;
    border-width: 0 1px 1px 0 !important;
  }
}
</style>
