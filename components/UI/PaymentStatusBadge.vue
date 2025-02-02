<template>
    <Badge :class="statusObj.class">{{statusObj.name}}</Badge>
</template>

<script setup>
import { Badge } from '~/components/shadcn/ui/badge'
import {computed, defineProps} from 'vue'

const props = defineProps({
    status: {
        type: String,
        required: true,
    },
})

const statusObj = computed(() => {
    switch(props.status) {
        case 'pending':
            return {
                class: 'bg-amber-400',
                name: 'Ожидает оплаты'
            }
        case 'paid':
            return {
                class: 'bg-positive text-white',
                name: 'Оплачено'
            }
        case 'rejected':
            return {
                class: 'bg-destructive text-white',
                name: 'Отменено'
            }
        case 'error':
            return {
                class: 'bg-destructive text-white',
                name: 'Ошибка'
            }
            default:
                return {
                    class: 'bg-amber-400',
                    name: 'Ожидает оплаты'
                }
    }
})
</script>

<style>

</style>