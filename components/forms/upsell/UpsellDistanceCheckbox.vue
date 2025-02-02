<template>
    <div
            v-if="!!distance"
            @click="changeCheckbox"
            class="athlete_checkboxes__distancies__item flex justify-between py-3 cursor-pointer"
    >
        <span
                class="font-bold"
                :class="checked ? 'text-positive' : ''"
        >{{ distance.name }}</span>
        <input
                :checked="checked"
                type="checkbox"
                class="form-check-input ml-2"
        />
    </div>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
    extra_service_id: {
        type: Number,
        required: true
    },
    athlete_id: {
        type: Number,
        required: true
    },
    distance_id: {
        type: Number,
        required: true
    }
})

const postData = inject('postData')
const extra_items = inject('extra_items', [])
const addExtraItem = inject('addExtraItem')
const deleteExtraItem = inject('deleteExtraItem')

const extraItemKey = computed(() =>
    `${props.extra_service_id}__${props.athlete_id}__${props.distance_id}`
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
            distance_id: props.distance_id,
            key: extraItemKey.value,
        }
    }
    return extra_item
})

const distance = computed(() =>
    postData.distances.find(item => item.id === props.distance_id)
)

const checked = computed(() =>
    extra_items.value.some(item => item.key === extraItemKey.value)
)

const changeCheckbox = () => {
    if (!checked.value) {
        addExtraItem(extraItem.value)
        return
    }
    deleteExtraItem(extraItemKey.value)
}
</script>

<style></style>