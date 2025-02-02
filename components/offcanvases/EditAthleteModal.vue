<template>
    <Sheet v-model:open="visibleModal">
        <SheetTrigger as-child>
            <slot/>
        </SheetTrigger>
        <SheetContent class="min-w-full md:min-w-[500px]">
            <SheetHeader class="mb-9">
                <p v-if="selected_athlete" class="font-oswald uppercase text-2xl md:text-4xl mb-2">Редактировать атлета</p>
                <p v-else class="font-oswald uppercase text-2xl md:text-4xl mb-2">Добавить атлета</p>
                <p class="text-sm md:text-base text-sub">Заполните все поля и приложите указанные документы, если вы планируете проходить комиссию по допуску онлайн</p>
            </SheetHeader>

            <Tabs v-if="selected_athlete && !selectedMode" default-value="athlete" class="w-full mb-6" v-model="mode">
                <TabsList class="grid w-full grid-cols-2">
                    <TabsTrigger value="athlete" class="text-xs md:text-sm">
                        Редактировать атлета
                    </TabsTrigger>
                    <TabsTrigger value="documents" class="text-xs md:text-sm">
                        Добавить документы
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            <AthleteDocumentsForm
                    v-if="selected_athlete && (mode === 'documents' || selectedMode === 'documents')"
                    :document-schema="requiredDocuments || globalStore.athlete_documents"
                    :initial-value="selected_athlete.documents"
                    :selected_athlete="selected_athlete"
                    @saved="visibleModal = false"
            />

            <Form v-if="mode === 'athlete' && selectedMode !== 'documents'" @submit="onSubmit" v-slot="{errors, meta}" class="grid gap-4">
                <ImageField
                        name="avatar"
                        label="Аватар"
                        :max-size="2 * 1024 * 1024"
                        :accepted-types="['image/jpeg', 'image/png', 'image/webp']"
                        :initial-value="initialData.avatar"
                        dropZoneClass="h-[150px]"
                />
                <TextField
                        name="lastname"
                        label="Фамилия"
                        placeholder="Иванов"
                        :initial-value="initialData.lastname"
                        :disabled="!!selected_athlete"
                        required
                />
                <TextField
                        name="firstname"
                        label="Имя"
                        placeholder="Иван"
                        :initial-value="initialData.firstname"
                        :disabled="!!selected_athlete"
                        required
                />
                <TextField
                        name="fathername"
                        label="Отчество"
                        placeholder="Иванович"
                        :initial-value="initialData.fathername"
                />
                <div class="grid md:grid-cols-3 gap-4 md:gap-2">
                    <DateField
                            name="birthdate"
                            label="Дата рождения"
                            :disabled="!!selected_athlete"
                            :initial-value="initialData.birthdate"
                            :min-date="format(subYears(new Date(), 45), 'yyyy-MM-dd')"
                            :max-date="format(subYears(new Date(), 5), 'yyyy-MM-dd')"
                            required
                    />
                    <SelectField
                            :options="genderEnum"
                            name="gender"
                            label="Пол"
                            placeholder="Выберите"
                            :initial-value="initialData.gender"
                            required
                    />
                    <SelectField
                            :options="categoryEnum"
                            name="category"
                            label="Разряд"
                            placeholder="Выберите"
                            :initial-value="initialData.category"
                            required />
                </div>
                <SelectField
                        :options="globalStore.countries"
                        name="nation"
                        label="Гражданство"
                        placeholder="Выберите вариант"
                        option-label="name"
                        option-value="code"
                        :initial-value="initialData.nation"
                        required
                />
                <GlobalErrorAlert v-if="errors.global" :error="errors.global" />
                <Button :disabled="loading" variant="primary" type="submit" class="rounded-full mt-auto px-5 py-7 mb-7">
                    <span v-if="loading"><Icon name="svg-spinners:ring-resize" /></span>
                    <span v-else>Сохранить</span>
                </Button>
            </Form>
        </SheetContent>
    </Sheet>
</template>

<script setup>
import {useGlobalStore} from '@/store/globalStore'
import {Sheet, SheetContent, SheetHeader, SheetTrigger} from "~/components/shadcn/ui/sheet";
import {Form} from "vee-validate";
import {Button} from "~/components/shadcn/ui/button";
import GlobalErrorAlert from "~/components/forms/GlobalErrorAlert.vue";
import TextField from "~/components/UI/Fields/TextField.vue";
import DateField from "~/components/UI/Fields/DateField.vue";
import SelectField from "~/components/UI/Fields/SelectField.vue";
import {format, subYears} from "date-fns";
import ImageField from "~/components/UI/Fields/ImageField.vue";
import {useToast} from "~/components/shadcn/ui/toast";
import {Tabs, TabsList, TabsTrigger} from "~/components/shadcn/ui/tabs";
import AthleteDocumentsForm from "~/components/forms/AthleteDocumentsForm.vue";

const props = defineProps({
    selected_athlete: {
        type: Object,
        default: null
    },
    selectedMode: {
        type: String,
        default: 'athlete'
    },
    requiredDocuments: {
        type: Array,
    }
})

const athleteStore = useAthleteStore()
const { toast } = useToast()

const genderEnum = [
    {
        label: 'Муж.',
        value: 'M'
    },
    {
        label: 'Жен.',
        value: 'F'
    }
]

const categoryEnum = [
    {
        label: 'Нет разряда',
        value: 'Нет разряда'
    },
    {
        label: 'III юн.',
        value: 'III юн.'
    },
    {
        label: 'II юн.',
        value: 'II юн.'
    },
    {
        label: 'I юн.',
        value: 'I юн.'
    },
    {
        label: 'III',
        value: 'III'
    },
    {
        label: 'II',
        value: 'II'
    },
    {
        label: 'I',
        value: 'I'
    },
    {
        label: 'КМС',
        value: 'КМС'
    },
    {
        label: 'МС',
        value: 'МС'
    },
    {
        label: 'МСМК',
        value: 'МСМК'
    }
]

const globalStore = useGlobalStore();
const visibleModal = ref(false)
const loading = ref(false)
const initialData = ref({
    avatar: null,
    firstname: null,
    lastname: null,
    fathername: null,
    birthdate: null,
    gender: null,
    category: null,
    nation: null,
})

const mode = ref('athlete')

watch(visibleModal, (value) => {
    if(value && props.selected_athlete){
        initialData.value = {
            avatar: props.selected_athlete.avatar,
            firstname: props.selected_athlete.firstname,
            lastname: props.selected_athlete.lastname,
            fathername: props.selected_athlete.fathername,
            birthdate: props.selected_athlete.birthdate,
            gender: props.selected_athlete.gender,
            category: props.selected_athlete.category,
            nation: props.selected_athlete.nation,
        }
    }
})

async function onSubmit(values, context) {
    loading.value = true
    if(props.selected_athlete){
        await athleteStore.updateAthlete(values, props.selected_athlete.id)
            .then((response) => {
                toast({
                    title: 'Атлет успешно обновлен',
                    variant: 'success',
                })
                visibleModal.value = false
            }).catch((error) => {
                context.setErrors({global: error.data?.message, ...error.data.errors})
            })
    } else {
        await athleteStore.createAthlete(values)
            .then((response) => {
                toast({
                    title: 'Атлет успешно добавлен',
                    variant: 'success',
                })
                visibleModal.value = false
            }).catch((error) => {
                context.setErrors({global: error.data?.message, ...error.data.errors})
            })
    }
    loading.value = false
}

</script>

<style></style>