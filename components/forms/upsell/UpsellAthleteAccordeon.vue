<template>
    <div v-if="athlete" class="athlete_checkboxes__item mb-2 bg-slate-100 rounded cursor-pointer">
        <div
                @click="isAthleteOpened = !isAthleteOpened"
                class="rounded bg-slate-100 flex justify-between items-center p-3"
        >
            <div class="table_name_item flex items-center">
                <Avatar :name="athlete.name" :src="athlete.avatar" class="me-2" />
                <div class="name">
                    <span class="font-bold">{{ athlete.name }}</span>
                </div>
            </div>
            <Icon :name="isAthleteOpened ? 'ri:arrow-down-s-line' : 'ri:arrow-up-s-line'" class="text-sub" size="20" />
        </div>

        <transition name="slide">
            <div v-if="isAthleteOpened" class="rounded-b bg-slate-50 px-3">
                <UpsellDistanceCheckbox
                        v-for="distanceId in distances"
                        :key="distanceId"
                        :distance_id="distanceId"
                        :athlete_id="athlete_id"
                        :extra_service_id="extra_service_id"
                />
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import UpsellDistanceCheckbox from './UpsellDistanceCheckbox.vue'
import Avatar from '../../UI/Avatar.vue'

const props = defineProps({
    extra_service_id: {
        type: [Number, String],
        required: true
    },
    athlete_id: {
        type: [Number, String],
        required: true
    },
    distances: {
        type: Array,
        default: () => []
    }
})

const athleteStore = useAthleteStore()
const isAthleteOpened = ref(false)

const athlete = computed(() =>
    athleteStore.athletes.find(item => item.id == props.athlete_id)
)
</script>

<style scoped>
.athlete_checkboxes__header .form-check-input:checked {
    background-color: #071031;
    border-color: #071031;
}

.athlete_checkboxes__distancies .form-check-input:checked {
    background-color: #28c76f;
    border-color: #28c76f;
}
</style>