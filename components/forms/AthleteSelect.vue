<template>
		<div>
            <div class="flex gap-2 items-center justify-between mb-1">
                <label for="add_edit" class="font-bold leading-none text-sm">
                    Выберите участника
                    <span class="text-red-500">*</span>
                </label>
                <div v-if="!hasDistances" class="text-end">
                    <Button
                            @click.prevent="() => searchInDatabase = !searchInDatabase"
                            variant="link"
                            size="sm"
                            class="text-sub font-regular font-normal h-auto p-0">
                        {{searchInDatabase ? 'Выбрать из аккаунта' : 'Выбрать из базы'}}
                    </Button>
                </div>
            </div>
			<div class="w-full">
                <div class="flex gap-1">
                    <div class="flex-1">
                        <AthleteSelectField
                                :mode="searchInDatabase ? 'autocomplete' : 'select'"
                                :name="name"
                                :options="searchInDatabase ? finded_athletes : athleteStore.userAthletes"
                                placeholder="Выберите атлета"
                                option-label="name"
                                option-value="id"
                                required
                                :disabled-condition="(option) => isAthleteDisable(option)"
                                :get-description="(option) => disableAthleteReason(option)"
                                @select="selectAthlete"
                                :disabled="hasDistances"
                                @search="onSearch"
                        />
                    </div>
                    <EditAthleteModal v-if="!searchInDatabase && athleteId" :selected_athlete="athlete">
                        <Button type="button" variant="secondary" size="icon" class="h-10 w-10"><Icon name="ri:edit-2-line" /></Button>
                    </EditAthleteModal>
                    <EditAthleteModal v-else-if="!athleteId">
                        <Button type="button" variant="secondary" size="icon" class="h-10 w-10"><Icon name="ri:add-fill" /></Button>
                    </EditAthleteModal>
                </div>
			</div>
		</div>
</template>

<script setup>
import 'vue-select/dist/vue-select.css'
import { ref, computed, defineProps, defineEmits, inject, watch } from 'vue'
import {useField} from "vee-validate";
import {Button} from "~/components/shadcn/ui/button";
import EditAthleteModal from "~/components/offcanvases/EditAthleteModal.vue";
import moment from "moment";
import AthleteSelectField from "~/components/UI/Fields/AthleteSelectField.vue";


const props = defineProps({
    hasDistances: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['selectAthlete'])
const { $swal } = useNuxtApp()
const postData = inject("postData");
const athletesSetFields = inject("athletesSetFields");
const disallowed_athletes = inject('disallowed_athletes', () => [])
const localdisallowed_athletes = inject('localdisallowed_athletes', () => [])

const searchInDatabase = ref(false)
const finded_athletes = ref([])

const athleteStore = useAthleteStore()
const {value: athleteId, setValue: athleteSetValue} = useField(props.name)

const athlete = computed(() => {
    return athleteStore.athletes.find(item => item.id === athleteId.value)
})

const usedAthletes = computed(() => {
    return athletesSetFields.value.map(fieldgroup => fieldgroup.value.athlete_id)
})

function isAthleteDisable(athlete){
    return usedAthletes.value.includes(athlete.id) ||
        disallowed_athletes.includes(athlete.id) ||
        !getAthleteAgelimit(athlete) ||
        !hasAgeLimitPlaces(athlete) ||
        localdisallowed_athletes.value.includes(athlete.id) ||
        !athletehasDistances(athlete)
}

function disableAthleteReason(athlete){
    if(usedAthletes.value.includes(athlete.id)){
        return 'Участник уже добавлен'
    }
    if(disallowed_athletes.includes(athlete.id)){
        return 'Участник уже заявлен'
    }
    if(!getAthleteAgelimit(athlete)){
        return 'Участник не подходит к этому событию'
    }
    if(!hasAgeLimitPlaces(athlete) || localdisallowed_athletes.value.includes(athlete.id)){
        return 'Нет мест в возрастном лимите'
    }
    if(!athletehasDistances(athlete)){
        return 'Нет подходящих дистанций'
    }
    return ''
}

function athletehasDistances(athlete){
    const birthdate = moment(athlete.birthdate)
    let years = moment().endOf('year').diff(birthdate, 'years')
    if (postData.agedata_value) {
        years = moment(postData.agedata_value).diff(birthdate, 'years')
    }

    return postData.distances.some((item) => item.agemin <= years && item.agemax >= years && item.gender === athlete.gender)
}

function getAthleteAgelimit(athlete) {
    const current_age_limit = postData.age_limits.find((item) => {
        const athleteYear = athlete.birthdate.split('-')[0]
        if (athlete.gender === 'M') {
            return item.male_years.includes(athleteYear)
        } else if (athlete.gender === 'F') {
            return item.female_years.includes(athleteYear)
        }
        return item.gender === athlete.gender && item.years.includes(athleteYear)
    })
    
    return current_age_limit ?? null
}

function hasAgeLimitPlaces(athlete) {
    const current_age_limit = getAthleteAgelimit(athlete)
    return current_age_limit?.has_vacant_places ?? false
}

async function onSearch(search) {
    if (search.length > 3) {
        finded_athletes.value = await athleteStore.searchAthletes(search) || []
    }
}

function selectAthlete(athlete) {
    athleteId.value = athlete.id || null
    if (searchInDatabase.value) {
        athleteStore.addOrChangeAthlete(athlete)
        athleteStore.getDocuments(athlete.id)
    }
    emit('selectAthlete', athlete)
}

/** Очистка выбранного атлета */
function clearData() {
    athleteSetValue(null)
    emit('selectAthlete', null)
}

function checkAthleteFromDatabase() {
    if (athleteId.value) {
        const exist = athleteStore.athletes.find((item) => item.id === athleteId.value)
        if (!exist) searchInDatabase.value = true
    }
}

/** Проверка, не заявлен ли атлет и, если да, показ ошибки */
function checkAthleteDistallowed(athlete_id) {
    if (disallowed_athletes.value.includes(athlete_id)) {
        $swal.fire(
            'Этот спортсмен уже заявлен',
            'Если вы сами подавали заявку с этим спортсменом для этого мероприятия, вы можете отредактировать эту заявку в разделе "Мои заявки" вашего аккаунта',
            'error'
        )
        return false
    }
    return true
}

/* -- Аналог watch theModel -- */
watch(
    () => athleteId,
    (newVal, oldVal) => {
        if (!checkAthleteDistallowed(newVal)) {
            athleteSetValue(oldVal)
            return
        }
        checkAthleteFromDatabase()
    }
)

/* -- Регистрация компонентов -- */
</script>
