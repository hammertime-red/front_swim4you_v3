<template>
    <OffcanvasInline
        id="add_club"
        :visible="visible"
        @hide="$emit('hide'), (visible = !visible)"
        @show="showModal"
    >

        <p v-if="selected_club" class="section_title_medium mb-2">Редактировать клуб</p>
        <p v-else class="section_title_medium mb-2">Добавить клуб</p>
        <p class="text-sub">Пожалуйста, внимательно заполните все поля</p>

        <SelectButton
            v-if="!selected_club"
            v-model="mode"
            :options="[
                { label: 'Выбрать из списка', value: 'select' },
                { label: 'Создать новый', value: 'create' }
            ]"
            class="mb-4"
            optionLabel="label"
            optionValue="value"
        />

        <template v-if="mode === 'select'">
            <label class="mb-3 block w-full">
                <span class="font-bold">Выберите клуб <span class="text-red-500">*</span></span>
                <AutoComplete
                    :delay="500"
                    :minLength="3"
                    :suggestions="search_clubs_list"
                    class="w-full"
                    emptySearchMessage="Нет подходящий вариантов"
                    forceSelection
                    inputClass="w-full"
                    optionLabel="name"
                    placeholder="Начните вводить название"
                    size="large"
                    @clear="clearClub"
                    @complete="searchClubs"
                    @option-select="setClub"
                    @option-unselect="clearClub"
                />
            </label>
        </template>

        <Form @submit="onSubmit">
            <template v-if="mode === 'create'">
                <div class="mb-3 block w-full">
                    <span class="font-bold">Название клуба <span class="text-red-500">*</span></span>
                    <Field name="name" :rules="zodRule(nameSchema)" v-model="form_data.name">
                        <template #default="{ field, meta }">
                            <InputText
                                v-bind="field"
                                :invalid="meta.validated && !meta.valid"
                                placeholder="Введите текст"
                                size="large"
                                type="text"
                                class="w-full"
                            />
                            <ErrorMessage name="name" v-if="!meta.valid" class="text-red-500 text-sm block"/>
                        </template>
                    </Field>
                </div>

                <div class="mb-3 block w-full">
                    <span class="font-bold">Короткое название <span class="text-red-500">*</span></span>
                    <Field name="short_name" :rules="zodRule(shortNameSchema)" v-model="form_data.short_name">
                        <template #default="{ field, meta }">
                            <InputText
                                v-bind="field"
                                :invalid="meta.validated && !meta.valid"
                                placeholder="Введите текст"
                                size="large"
                                type="text"
                                class="w-full"
                            />
                            <small class="text-secondary">Для размещения на табло. Не более 16 символов</small>
                            <ErrorMessage name="short_name" v-if="!meta.valid" class="text-red-500 text-sm block"/>
                        </template>
                    </Field>
                </div>

                <div class="flex gap-4">
                    <div class="d-block mb-3 w-50">
                        <span class="font-bold">Страна</span>
                        <Select
                            v-model="filter_country"
                            :options="globalStore.countries"
                            class="w-full"
                            input-class="w-full"
                            optionLabel="name"
                            optionValue="id"
                            placeholder="Выберите страну"
                            size="large"
                        />
                    </div>

                    <div class="d-block mb-3 w-50">
                        <span class="font-bold">Субъект</span>
                        <AutoComplete
                            :delay="500"
                            :minLength="3"
                            :suggestions="filter_regions"
                            class="w-full"
                            emptySearchMessage="Нет подходящих вариантов"
                            forceSelection
                            inputClass="w-full mt-0"
                            optionLabel="name"
                            optionValue="id"
                            placeholder="Начните вводить название"
                            size="large"
                            @clear="() => filter_region = null"
                            @complete="searchRegion"
                            @option-select="(event) => filter_region = event.value?.id"
                            @option-unselect="() => filter_region = null"
                        />
                    </div>
                </div>

                <div class="d-block mb-3">
                    <span class="font-bold">Город <span class="text-red-500">*</span></span>
                    <Field name="city_id" :rules="zodRule(cityIdSchema)" v-model="form_data.city_id">
                        <template #default="{ field, meta }">
                            <AutoComplete
                                :delay="500"
                                :minLength="3"
                                :invalid="meta.validated && !meta.valid"
                                :suggestions="filter_cities"
                                class="w-full"
                                emptySearchMessage="Нет подходящих вариантов"
                                forceSelection
                                inputClass="w-full"
                                optionLabel="name"
                                optionValue="id"
                                placeholder="Начните вводить название"
                                size="large"
                                v-model="selectedCity"
                                @complete="searchCity"
                                @option-select="(event)  => field.value = event.value?.id"
                                @option-unselect="() => field.value = null"
                            />
                            <ErrorMessage name="city_id" v-if="!meta.valid" class="text-red-500 text-sm block"/>
                        </template>
                    </Field>
                </div>
            </template>

            <div class="form-check bg-body mb-3 p-2 its_me_check">
                <label class="form-check-label text-sm font-bold" for="auth_accept">
                    Представитель – это я
                </label>
                <input
                    id="auth_accept"
                    v-model="its_me"
                    class="form-check-input"
                    type="checkbox"
                    value="1"
                    @change="itsMeMario"
                />
            </div>

            <div class="mb-3 block w-full">
                <span class="font-bold">ФИО представителя <span class="text-red-500">*</span></span>
                <Field name="agent_name" :rules="zodRule(agentNameSchema)" v-model="form_data.agent_name">
                    <template #default="{ field, meta }">
                        <InputText
                            v-bind="field"
                            :invalid="meta.validated && !meta.valid"
                            placeholder="Введите текст"
                            size="large"
                            type="text"
                            class="w-full"
                        />
                        <ErrorMessage name="agent_name" v-if="!meta.valid" class="text-red-500 text-sm block"/>
                    </template>
                </Field>
            </div>

            <div class="mb-3 block w-full">
                <span class="font-bold">Телефон представителя <span class="text-red-500">*</span></span>
                <Field name="agent_phone" :rules="zodRule(agentPhoneSchema)" v-model="form_data.agent_phone">
                    <template #default="{ field, meta }">
                        <InputMask
                            v-bind="field"
                            :invalid="meta.validated && !meta.valid"
                            mask="+9 (999) 999 9999"
                            placeholder="+7 (___) ___ ____"
                            size="large"
                            type="text"
                            class="w-full"
                        />
                        <ErrorMessage name="agent_phone" v-if="!meta.valid" class="text-red-500 text-sm block"/>
                    </template>
                </Field>
            </div>

            <div class="mb-3 block w-full">
                <span class="font-bold">Email представителя <span class="text-red-500">*</span></span>
                <Field name="agent_email" :rules="zodRule(agentEmailSchema)" v-model="form_data.agent_email">
                    <template #default="{ field, meta }">
                        <InputText
                            v-bind="field"
                            :invalid="meta.validated && !meta.valid"
                            placeholder="Введите email"
                            size="large"
                            type="text"
                            class="w-full"
                        />
                        <ErrorMessage name="agent_email" v-if="!meta.valid" class="text-red-500 text-sm block"/>
                    </template>
                </Field>
            </div>

            <Button label="Сохранить" type="submit"
                    class="btn btn-primary btn-primary-shadow btn-rounded mt-auto px-5 mb-7"
                    size="large" />
        </Form>
    </OffcanvasInline>
</template>

<script setup>
import OffcanvasInline from "./OffcanvasInline.vue"
import api from "@/store/api"
import 'vue-select/dist/vue-select.css'

import AutoComplete from 'primevue/autocomplete';
import {SelectButton} from "primevue";
import Button from 'primevue/button';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';

import {ref, onMounted, watch} from "vue";
import { Form, Field, ErrorMessage } from 'vee-validate';
import { z } from 'zod';

const globalStore = useGlobalStore();
const userStore = useUserStore();

const props = defineProps({
    selected_club: {
        type: Object,
        default: () => null
    },
    visible: {
        type: Boolean,
        default: false
    }
})

const form_data = ref({
    name: '',
    short_name: '',
    city_id: null,
    agent_name: '',
    agent_phone: '',
    agent_email: '',
})

const selectedCity = ref(null)


watch(selectedCity, () => {
    if(selectedCity.value?.id){
        form_data.value.city_id = selectedCity.value?.id;
    } else {
        form_data.value.city_id = null;
    }
})

// Определяем отдельные схемы для каждого поля
const nameSchema = z.string().min(1, 'Название клуба обязательно').default('');
const shortNameSchema = z.string().min(1, 'Короткое название клуба обязательно').max(16, 'Короткое название клуба не должно быть более 16 символов');
const cityIdSchema = z.number({invalid_type_error: 'Неверный тип'}).min(1, 'Не указан город');
const agentNameSchema = z.string().min(1, 'Не указано имя представителя');
const agentPhoneSchema = z.string().min(1, 'Не указан телефон представителя');
const agentEmailSchema = z.string().min(1, 'Не указан email представителя').email('Некорректный email');

// Функция-обёртка для применения Zod-схемы на уровне rules
function zodRule(schema) {
    return (value) => {
        const result = schema.safeParse(value);
        return result.success ? true : result.error.issues[0].message;
    };
}

const filter_country = ref(null)
const filter_regions = ref([])
const filter_region = ref(null)
const filter_cities = ref([])
const search_clubs_list = ref([])
const mode = ref('select')
const its_me = ref(false)

onMounted(() => {
    if (props.selected_club) {
        mode.value = 'create'
        // При таком подходе вы можете вручную установить поля, если захотите,
        // через доступ к Field через ref или просто оставить их пустыми.
        // Здесь мы не используем setFieldValue, т.к. в данном примере мы не связаны через initialValues.
    }
})

async function searchClubs(event) {
    if (!event.query.trim().length) {
        search_clubs_list.value = []
    } else if (event.query.trim().length >= 3) {
        const response = await globalStore.fetchDictionaryClubs(event.query)
        search_clubs_list.value = response.data
    }
    return search_clubs_list.value
}

function setClub(event) {
    if (event?.value) {
        form_data.value.name = event.value.name
        form_data.value.short_name = event.value.short_name
        form_data.value.city_id = event.value.city_id
    }
}

function clearClub() {
    form_data.value.name = ''
    form_data.value.short_name = ''
    form_data.value.city_id = null
}

async function searchRegion(event) {
    if (!event.query.trim().length) {
        filter_regions.value = []
    } else if (event.query.trim().length >= 3) {
        const response = await globalStore.fetchDictionaryRegions(event.query, filter_country.value)
        filter_regions.value = response.data
    }
    return filter_regions.value
}

async function searchCity(event) {
    if (!event.query.trim().length) {
        filter_cities.value = []
    } else if (event.query.trim().length >= 3) {
        const response = await globalStore.fetchDictionaryCities(event.query, filter_region.value, filter_country.value)
        filter_cities.value = response.data
    }
    return filter_cities.value
}

function itsMeMario() {
    if (its_me.value) {
        form_data.value.agent_name = userStore.userdata.name
        form_data.value.agent_phone = userStore.userdata.phone
        form_data.value.agent_email = userStore.userdata.email
    } else {
        form_data.value.agent_name = ''
        form_data.value.agent_phone = ''
        form_data.value.agent_email = ''
    }
}

function onSubmit(values) {
    console.log(form_data.value)
    // Здесь values будут содержать введенные значения полей, если все поля валидны.
    alert(JSON.stringify(values, null, 2));
}
</script>

<style>
.its_me_check {
    padding-left: 40px !important;
    border-radius: 5px;
}

.invalid .vs__dropdown-toggle {
    border-color: red !important;
}
</style>
