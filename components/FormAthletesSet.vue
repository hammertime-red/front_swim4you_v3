<script setup>
import AthletFieldgroup from '~/components/forms/AthletFieldgroup.vue'
import {computed, inject} from 'vue'
import {useFieldArray} from "vee-validate";
import {Button} from "~/components/shadcn/ui/button";
import {defaultAthlete} from "~/types/form/AthleteFieldgroup";

const props = defineProps({
    title: {
        type: String,
        default: null,
    },
    subtitle: {
        type: String,
        default: null,
    },
})

const localdisallowed_athletes = ref([])
const loading = ref(false)

provide('athletesSetFields', computed(() => fields.value))
provide('localdisallowed_athletes', localdisallowed_athletes)

function disallowAthlete(athlete_id){
    if(!localdisallowed_athletes.value.includes(athlete_id)){
        localdisallowed_athletes.value.push(athlete_id)
    }
}

const { fields, push, remove } = useFieldArray('items')

onMounted(() => {
    if(!fields.value.length){
        push(defaultAthlete)
    }
})
</script>

<template>
    <div class="">
    <h2 v-if="title" class="section_title_medium mb-2">{{ title }}</h2>
    <p v-if="subtitle" class="text-sub">{{ subtitle }}</p>
    <div class="relative mt-5">
        <AthletFieldgroup
            v-for="(field, index) in fields"
            :index="index"
            :canDelete="fields.length > 1"
            @remove="remove(index)"
            @disallowAthlete="disallowAthlete"
        />

        <div v-if="loading" class="loading_overlay absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center text-primary-500">
            <Icon name="svg-spinners:ring-resize" size="40" />
        </div>
    </div>

    <Button variant="secondary" size="lg" class="" @click.prevent="() => push(defaultAthlete)">
        <Icon name="ri:add-fill" /> Добавить спортсмена
    </Button>
    </div>
</template>