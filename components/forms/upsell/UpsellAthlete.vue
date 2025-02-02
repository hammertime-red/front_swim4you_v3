<template>
    <div v-if="athlete" class="athlete_checkboxes__item mb-2">
        <div
                @click="changeCheckbox"
                class="rounded bg-slate-100 flex justify-between items-center p-3 cursor-pointer"
        >
            <div class="table_name_item flex items-center">
                <Avatar :name="athlete.name" :src="athlete.avatar" :class="'me-2'" />
                <div class="name">
                    <span class="font-bold" :class="checked ? 'text-positive' : ''">{{ athlete.name }}</span>
                </div>
            </div>
            <input
                    ref="checkbox"
                    :checked="checked"
                    type="checkbox"
                    class="form-check-input ml-2"
            />
        </div>
    </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import { useStore } from 'vuex'
import Avatar from '../../UI/Avatar.vue'

const props = defineProps({
    extra_service_id: {
        type: [Number, String],
        required: true,
    },
    athlete_id: {
        type: [Number, String],
        required: true,
    },
})

const store = useStore()
const athleteStore = useAthleteStore()
const checkbox = ref(null)
const extra_items = inject('extra_items', [])
const addExtraItem = inject('addExtraItem')
const deleteExtraItem = inject('deleteExtraItem')

const extraItemKey = computed(() =>
    `${props.extra_service_id}__${props.athlete_id}`
)

const extraItem = computed(() => {
    let extra_item = extra_items.value.find(item => item.key === extraItemKey.value)
    if (!extra_item) {
        extra_item = {
            order_extra_item_id: null,
            is_payed: false,
            extra_service_id: props.extra_service_id,
            quantity: 1,
            athlete_id: props.athlete_id,
            distance_id: null,
            key: extraItemKey.value,
        }
    }
    return extra_item
})

const checked = computed(() =>
    extra_items.value.some(item => item.key === extraItemKey.value)
)

const athlete = computed(() =>
    athleteStore.athletes.find(item => item.id === props.athlete_id)
)

const changeCheckbox = () => {
    if (!checked.value) {
        addExtraItem(extraItem.value)
        return
    }
    deleteExtraItem(extraItemKey.value)
}
</script>

<style scoped>
.athlete_checkboxes__header .form-check-input:checked {
    background-color: #071031;
    border-color: #071031;
}

.athlete_checkboxes__distancies .form-check-input:checked {
    background-color: #28C76F;
    border-color: #28C76F;
}

.slide-enter-active,
.slide-leave-active {
    transition: max-height 0.2s ease-in-out;
}

.slide-enter-to,
.slide-leave-from {
    overflow: hidden;
    max-height: 1000px;
}

.slide-enter-from,
.slide-leave-to {
    overflow: hidden;
    max-height: 0;
}
</style>