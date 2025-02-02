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
        case 'draft':
            return {
                class: 'bg-slate-300 text-main',
                name: 'Черновик'
            }
        case 'sent':
            return {
                class: 'bg-primary-500 text-white',
                name: 'Отправлен'
            }
        case 'accepted':
            return {
                class: 'bg-positive text-white',
                name: 'Принят'
            }
        case 'pending_payment':
            return {
                class: 'bg-amber-400 text-main',
                name: 'Ожидает оплаты'
            }
        case 'сond_admitted':
            return {
                class: 'bg-positive text-white',
                name: 'Условно допущен'
            }
        case 'admitted':
            return {
                class: 'bg-positive text-white',
                name: 'Допущен'
            }
        case 'rejected':
            return {
                class: 'bg-destructive text-white',
                name: 'Отклонен'
            }
    }
})
</script>

<style>

</style>