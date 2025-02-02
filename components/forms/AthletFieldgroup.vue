<template>
    <div class="inputgroup_athlet content_box px-4 py-6 mb-4">
        <button
                v-if="canDelete"
                class="btn btn-circle text-sub mb-2 ms-auto"
                @click.prevent="$emit('remove', index)">
            <Icon name="ri:delete-bin-5-line"/>
        </button>
        <div class="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-3">
            <AthleteSelect
                :hasDistances="used_distances.length > 0"
                :name="`items.${index}.athlete_id`"
                class="col-span-1 md:col-span-5"
                @selectAthlete="selectAthlete"
            />

            <div v-if="athleteId" class="grid grid-cols-1 md:grid-cols-12 gap-3 col-span-1 md:col-span-7">
                <div v-if="postData.required_documents && postData.required_documents.length"
                     class="col-span-1 md:col-span-6">
                    <CheckboxField
                            :initial-value="true"
                            :name="`items.${index}.is_online_request`"
                            class="md:mt-[24px]"
                            label="Предоставить документы для онлайн-допуска"
                            label-class="leading-snug"
                            @change="(value) => is_online_request = value"
                    />
                </div>

                <div v-if="is_online_request" class="col-span-1 md:col-span-6">
                    <p class="font-bold text-sm mb-1">
                        Документы
                        <span class="text-red-500">*</span>
                    </p>
                    <div class="docs_checker__cont flex gap-1">
                        <div
                            :class="{
                                'bg-green-50 border-positive text-positive' : isDocumentsFull,
                                'bg-red-50 border-destructive text-destructive' : !isDocumentsFull,
                            }"
                             class="bg-body h-10 text-sm flex items-center justify-center border-l-4 w-full">
                            <span class="alert-title">{{ isDocumentsFull ? 'Добавлены' : 'Недостаточно' }}</span>
                        </div>
                        <EditAthleteModal v-if="athlete"
                              :required-documents="requiredDocuments"
                              :selected-mode="'documents'"
                              :selected_athlete="athlete">
                            <Button
                                :class="{
                                    'bg-positive hover:bg-positive/80' : isDocumentsFull,
                                    'bg-destructive hover:bg-destructive/80' : !isDocumentsFull,
                                }"
                                class="h-10 shrink-0 text-white"
                                type="button">
                                {{ isDocumentsFull ? 'Посмотреть' : 'Добавить' }}
                            </Button>
                        </EditAthleteModal>
                    </div>
                </div>

                <div v-if="!is_online_request && postData.offline_request_text"
                     class="col-span-1 md:col-span-12">
                    <div class="alert alert-warning bg-body mb-0 me-2"
                         v-html="postData.offline_request_text"/>
                </div>
            </div>

            <div v-if="athleteId && postData.distances.length"
                 class="col-span-1 md:col-span-12">
                <div class="grid gap-3">
                    <AthleteDistance
                            v-for="(distanceField, distanceIndex) in fields"
                            :name="`items.${props.index}.distances.${distanceIndex}`"
                            :allowedDistances="allowedDistances"
                            :athlete="athlete"
                            :canDelete="true"
                            :main-index="index"
                            :index="distanceIndex"
                            :used_distances="used_distances"
                            @removeDistance="remove(distanceIndex)"
                            class="p-2 border border-slate-100 rounded bg-slate-50 pt-8 md:pt-2"
                    />

                    <Alert v-if="!fields.length" variant="warning">
                        <div class="flex">
                            <Icon name="ri:error-warning-line" class="mr-2" />
                            <AlertTitle class="mb-0 font-bold text-sm">Необходимо добавить хотя бы одну дистанцию</AlertTitle>
                        </div>
                    </Alert>
                
                    <Button
                        :disabled="!hasAvailableDistances"
                        variant="accent"
                        class="w-fit"
                        size="lg"
                        @click.prevent="push({...defaultDistance})"
                    >
                        <Icon name="ri:add-fill" />
                        Добавить дистанцию
                    </Button>
                    
                </div>
            </div>


            <FormField :name="`items.${props.index}`" v-slot="{ errors }" >
                <Alert v-if="errors.length" variant="destructive" class="col-span-full">
                    <div class="flex">
                        <Icon name="ri:error-warning-line" class="mr-2" />
                        <div class="">
                            <AlertTitle v-for="error in errors" class="mb-0 font-bold text-sm">{{error}}</AlertTitle>
                        </div>
                    </div>
                </Alert>
            </FormField>
        </div>


        <div v-if="loading"
             class="loading_overlay absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center text-primary-500">
            <Icon name="svg-spinners:ring-resize" size="40"/>
        </div>
    </div>
</template>

<script setup>
import AthleteDistance from './AthleteDistance'
import AthleteSelect from './AthleteSelect'
import moment from 'moment'
import {ErrorMessage, useField, useFieldArray} from "vee-validate";
import CheckboxField from "~/components/UI/Fields/CheckboxField.vue";
import {defaultDistance} from "~/types/form/AthleteFieldgroup";
import {Button} from "~/components/shadcn/ui/button";
import EditAthleteModal from "~/components/offcanvases/EditAthleteModal.vue";
import {Alert, AlertTitle} from "~/components/shadcn/ui/alert";
import {FormField} from "~/components/shadcn/ui/form";

const props = defineProps({
    index: {
        type: Number,
    },
    canDelete: {
        type: Boolean,
        default: false,
    },
})
const emit = defineEmits(['remove', 'disallowAthlete'])

const postData = inject("postData");
const globalStore = useGlobalStore()
const athleteStore = useAthleteStore()
const loading = ref(false)
provide('setLoading', (value) => loading.value = value)

const is_online_request = ref(true)
const {value: athleteId} = useField(`items.${props.index}.athlete_id`)
const {fields, push, remove, replace} = useFieldArray(`items.${props.index}.distances`)

const used_distances = computed(() => {
    return fields.value.map(fieldgroup => fieldgroup.value.distance_id).filter(item => !!item)
})

const athlete = computed(() => {
    return athleteStore.athletes.find(item => item.id === athleteId.value)
})

const requiredDocuments = computed(() => {
    return globalStore.athlete_documents.filter(item => postData.required_documents.includes(item.id))
})
const isDocumentsFull = computed(() => {
    if(!athlete.value) return false
    return postData.required_documents.every(req =>
        athlete.value.documents.some(doc => doc.id === req)
    )
})

const allowedDistances = computed(() => {
    if (athlete.value && athlete.value.birthdate) {
        const birthdate = moment(athlete.value.birthdate)
        let years = moment().endOf('year').diff(birthdate, 'years')
        if (postData.agedata_value) {
            years = moment(postData.agedata_value).diff(birthdate, 'years')
        }

        return postData.distances.filter((item) => item.agemin <= years && item.agemax >= years && item.gender === athlete.value.gender)
    }
    return []
})

const hasAvailableDistances = computed(() => {
    return allowedDistances.value.some(distance => !used_distances.value.includes(distance.id))
})

function selectAthlete(value) {
    athleteId.value = value.id
    //push({...defaultDistance})
}

watch(athleteId, (value) => {
    if(!value){
        replace([])
    }
})

//setDistanceDisabled: 'events/setDistanceDisabled',
</script>