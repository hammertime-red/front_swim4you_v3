<template>
    <Sheet v-model:open="visibleModal">
        <SheetTrigger as-child>
            <slot/>
        </SheetTrigger>
        <SheetContent class="min-w-full md:min-w-[500px]">
            <SheetHeader class="mb-9">
                <p v-if="selected_club" class="section_title_medium mb-2">Редактировать клуб</p>
                <p v-else class="section_title_medium mb-2">Добавить клуб</p>
                <p class="text-sub">Пожалуйста, внимательно заполните все поля</p>
            </SheetHeader>

            <div class="grid gap-6">
                <template v-if="!selected_club">
                    <Tabs default-value="select" class="w-full" v-model="mode">
                        <TabsList class="grid w-full grid-cols-2">
                            <TabsTrigger value="select">
                                Выбрать из списка
                            </TabsTrigger>
                            <TabsTrigger value="create">
                                Создать новый
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>


                    <label class="block w-full" v-show="mode === 'select'">
                        <span class="font-bold text-sm">Выберите клуб <span class="text-red-500">*</span></span>
                        <Autocomplete
                                v-model="selectedClubId"
                                :options="search_clubs_list"
                                :loading="clubLoading"
                                placeholder="Начните вводить название"
                                @search="searchClubs"
                                @select="setClub"
                                @clear="clearClub"
                        />
                    </label>
                </template>
                
                <Form @submit="onSubmit" v-slot="{errors}" class="grid gap-4">
                    <div v-show="mode === 'create'" class="grid gap-4">
                        <TextField name="name" label="Название клуба" :initialValue="initialClub.name" required />
                        <TextField name="short_name" label="Короткое название" :initialValue="initialClub.short_name" required />
    
                        <div class="grid md:grid-cols-2 gap-3">
                            <div class="d-block">
                                <span class="font-bold text-sm mb-1">Страна</span>
                                <Select v-model="filter_country">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите страну" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem v-for="option in globalStore.countries" :value="option.id" :key="option.name">
                                            {{ option.name }}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
    
                            <div class="d-block">
                                <span class="font-bold text-sm">Субъект</span>
                                <Autocomplete
                                    v-model="filter_region"
                                    :options="filter_regions"
                                    placeholder="Начните вводить название"
                                    @search="searchRegion"
                                    @clear="filter_region = null"
                                />
                            </div>
                        </div>
                        
                        <AutocompleteField
                            name="city_id"
                            :options="filter_cities"
                            placeholder="Начните вводить название"
                            @search="searchCity"
                            label="Город"
                            required
                            :initial-value="initialClub.city_id"
                        />
                    </div>
    
                    <div class="flex justify-end">
                        <Button variant="secondary" size="sm" @click.prevent="itsMeMario">Представитель - это я</Button>
                    </div>
                    
                    <TextField name="agent_name" label="ФИО представителя" placeholder="Введите ФИО" :initial-value="initialAgent.name" required />
                    <PhoneField name="agent_phone" label="Телефон представителя" :initial-value="initialAgent.phone" required />
                    <EmailField name="agent_email" label="Email представителя" :initial-value="initialAgent.email" required />
                    
                    <GlobalErrorAlert v-if="errors.global" :error="errors.global" />
                    <Button variant="primary" type="submit" class="rounded-full mt-auto px-5 py-7 mb-7">Сохранить</Button>
                </Form>
            </div>
        </SheetContent>
    </Sheet>
</template>

<script setup>
import {Form} from 'vee-validate';
import {Sheet, SheetContent, SheetHeader, SheetTrigger} from "~/components/shadcn/ui/sheet";
import {Tabs, TabsList, TabsTrigger,} from '~/components/shadcn/ui/tabs'
import Autocomplete from "~/components/shadcn/custom/Autocomplete.vue";
import {Button} from "~/components/shadcn/ui/button";
import TextField from "~/components/UI/Fields/TextField.vue";
import PhoneField from "~/components/UI/Fields/PhoneField.vue";
import EmailField from "~/components/UI/Fields/EmailField.vue";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/shadcn/ui/select";
import AutocompleteField from "~/components/UI/Fields/AutocompleteField.vue";
import GlobalErrorAlert from "~/components/forms/GlobalErrorAlert.vue";
import {useToast} from "~/components/shadcn/ui/toast";

const globalStore = useGlobalStore();
const userStore = useUserStore();
const { toast } = useToast()
const loading = ref(false);

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

const clubLoading = ref(false)
const selectedClubId = ref(null)
const visibleModal = ref(false)

const initialAgent = ref({
    name: '',
    phone: '',
    email: '',
})

const initialClub = ref({
    name: '',
    short_name: '',
    city_id: null,
})

const filter_country = ref(null)
const filter_regions = ref([])
const filter_region = ref(null)
const filter_cities = ref([])
const search_clubs_list = ref([])
const mode = ref('select')

watch(visibleModal, (value) => {
    if(value && props.selected_club){
        mode.value = 'create'
        initialAgent.value = {
            name: props.selected_club.agent_name,
            phone: props.selected_club.agent_phone,
            email: props.selected_club.agent_email,
        }
        setClub(props.selected_club)
    }
})

async function searchClubs(query) {
    if (!query.trim().length) {
        search_clubs_list.value = []
    } else if (query.trim().length >= 3) {
        clubLoading.value = true
        await globalStore.fetchDictionaryClubs(query)
            .then((response) => {
                search_clubs_list.value = response
            }).catch((error) => {
            
            }).finally(() => {
                clubLoading.value = false
            })
    }
    return search_clubs_list.value
}

function setClub(club) {
    if(club){
        if(club?.city_id && club?.city_name){
            filter_cities.value = [{
                id: club.city_id,
                name: club.city_name,
            }]
        }
        if(club?.region_id && club?.region_name){
            filter_region.value = club.region_id
            filter_regions.value = [{
                id: club.region_id,
                name: club.region_name,
            }]
        }
        if(club?.country_id){
            filter_country.value = club.country_id
        }

        if(club?.name) initialClub.value.name = club.name
        if(club?.short_name) initialClub.value.short_name = club.short_name
        if(club?.city_id) initialClub.value.city_id = club.city_id
    }
}

function clearClub() {
    initialClub.value = {
        name: '',
        short_name: '',
        city_id: null,
    }
}

function clearAgent() {
    initialAgent.value = {
        name: '',
        phone: '',
        email: '',
    }
}

async function searchRegion(query) {
    if (!query.trim().length) {
        filter_regions.value = []
    } else if (query.trim().length >= 3) {
        filter_regions.value = await globalStore.fetchDictionaryRegions(query, filter_country.value)
    }
    return filter_regions.value
}

async function searchCity(query) {
    if (!query.trim().length) {
        filter_cities.value = []
    } else if (query.trim().length >= 3) {
        filter_cities.value = await globalStore.fetchDictionaryCities(query, filter_region.value, filter_country.value)
    }
    return filter_cities.value
}

function itsMeMario() {
    initialAgent.value.name = userStore.userdata.name
    initialAgent.value.phone = userStore.userdata.phone
    initialAgent.value.email = userStore.userdata.email
}

async function onSubmit(values, context) {
    if(props.selected_club){
        loading.value = true
        await userStore.updateClub(values, props.selected_club.id).then((response) => {
            clearClub()
            clearAgent()
            visibleModal.value = false
            toast({
                title: 'Клуб успешно обновлен',
                variant: 'success',
            })
        }).catch((e) => {
            context.setErrors({global: e.data?.message, ...e.data?.errors})
        }).finally(() => {
            loading.value = false
        })
    } else {
        loading.value = true
        await userStore.createClub(values).then((response) => {
            clearClub()
            clearAgent()
            visibleModal.value = false
            toast({
                title: 'Клуб успешно создан',
                variant: 'success',
            })
        }).catch((e) => {
            context.setErrors({global: e.data?.message, ...e.data?.errors})
        }).finally(() => {
            loading.value = false
        })
    }
}

</script>
