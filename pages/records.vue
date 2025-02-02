<template>
    <div class="mt-12 mb-20">
        <RatingsTitle class="mb-12" />
        <div class="container">
                <form @submit="onSubmit" class="bg-gradient-to-r from-[#005EFF] to-[#071031] p-7 rounded-2xl">
                    <div class="grid grid-cols-12 gap-4">
                        <div v-if="filtersData?.category_name" class="col-span-12 sm:col-span-6 lg:col-span-3">
                            <SelectField
                                    :options="filtersData?.category_name || []"
                                    name="category_name"
                                    label="Мероприятие/Competition"
                                    label-class="text-white"
                                    nullable
                                    placeholder="Все"
                                    :initial-value="null"
                            />
                        </div>
                        <div v-if="filtersData?.course" class="col-span-12 sm:col-span-6 lg:col-span-2">
                            <SelectField
                                    :options="filtersData?.course || []"
                                    name="cource"
                                    label="Бассейн/Pool"
                                    label-class="text-white"
                                    nullable
                                    placeholder="Все"
                                    :initial-value="initialValues.course"
                            />
                        </div>
                        <div v-if="filtersData?.gender" class="col-span-12 sm:col-span-6 lg:col-span-2">
                            <SelectField
                                    :options="filtersData.gender || []"
                                    name="gender"
                                    label="Пол/Gender"
                                    label-class="text-white"
                                    nullable
                                    placeholder="Все"
                                    :initial-value="initialValues.gender"
                            />
                        </div>
                        <div v-if="filtersData?.athlete_age" class="col-span-12 sm:col-span-6 lg:col-span-2">
                            <SelectField
                                    :options="filtersData.athlete_age || []"
                                    name="athlete_age"
                                    label="Возраст/Age"
                                    label-class="text-white"
                                    nullable
                                    placeholder="Любой возраст"
                                    :initial-value="null"
                            />
                        </div>
                        <div class="col-span-12 lg:col-span-3 flex flex-wrap sm:flex-nowrap items-end gap-4">
                            <div class="flex gap-4 w-full">
                                <Button type="reset" variant="outline" size="icon" class="h-10 w-10 border-white text-white shrink-0 rounded-full">
                                    <Icon name="ri:refresh-line" />
                                </Button>
                                <Button type="submit" variant="accent" :disabled="statusTableData !== 'success'" class="h-10 w-full uppercase rounded-full text-sm flex-grow">
                                    <span v-if="statusTableData !== 'success'"><Icon name="svg-spinners:ring-resize" /></span>
                                    <span v-else>Показать</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
                
                <div class="grid gap-12 mt-12" :class="{
                    'opacity-50': statusTableData !== 'success',
                }">
                    <div v-for="section in groupedRecords" class="">
                        <h2 class="font-oswald text-4xl uppercase mb-3">{{section.strokeName}}</h2>
                        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
                            <RecordCard v-for="item in section.items" :item="item" has_link />
                        </div>
                    </div>
                </div>
        </div>
    </div>
</template>

<script setup>
import Avatar from '../components/UI/Avatar'
import SelectField from "~/components/UI/Fields/SelectField.vue";
import {useForm, Form} from "vee-validate";
import {Button} from "~/components/shadcn/ui/button";
import RatingsTitle from "~/components/UI/RatingsTitle.vue";
import RecordCard from "~/components/cards/RecordCard.vue";

definePageMeta({
    name: 'records'
})

const initialValues = ref({
    category_name: null,
    course: 'SCM',
    gender: 'M',
})

const {values, meta, setValues, handleSubmit} = useForm({
    initialValues: {
        ...initialValues // если нужны начальные значения
    }
})
const {data: filtersData} = useAsyncData('ratings_filters', async () => {
    return await fetchData('results/filters', {
        method: 'GET',
    }).then(res => {
        if(res.category_name && res.category_name?.length){
            initialValues.value.category_name = res.category_name[0].value
            setValues({
                ...initialValues,
                category_name: res.category_name[0].value
            })
        }
        
        return res
    }).catch(error => console.error(error))
})

const {data: recordsData, refresh: refreshTableData, status: statusTableData} = useAsyncData(
    'records',
    () => getRecords(),
    {
        immediate: false
    }
)

async function getRecords(){
    const request = {...values}
    return await fetchData('records', {
        method: 'GET',
        query: {
            ...initialValues.value,
            ...request,
        }
    }).catch(error => console.error(error))
}

watch(filtersData, (newFiltersData) => {
    if (newFiltersData) {
        nextTick(() => {
            refreshTableData();
        })
    }
});

const onSubmit = handleSubmit(() => {
    refreshTableData()
})

const strokeOrder = [
    'Вольный стиль',
    'На спине',
    'Брасс',
    'Баттерфляй',
    'Комплекс'
];

const getStrokeIndex = (strokeName) => {
    const index = strokeOrder.indexOf(strokeName);
    return index === -1 ? strokeOrder.length : index;
};

const groupedRecords = computed(() => useSortBy(
    useToPairs(
        useGroupBy(recordsData.value, 'stroke_name')
    ),
    ([strokeName]) => getStrokeIndex(strokeName)
).map(([strokeName, items]) => ({
    strokeName,
    items
})));

</script>
