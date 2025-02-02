<template>
    <Badge :class="statusObj.class">{{statusObj.name}}</Badge>
</template>

<script setup>
import {Badge} from "~/components/shadcn/ui/badge";
import {computed} from "vue";

const props = defineProps({
    status: {
        type: String,
        required: true,
    },
})

const statusObj = computed(() => {
    switch(props.status) {
        case 'pending_payment':
            return {
                class: 'bg-amber-400 text-main',
                name: 'Ожидает оплаты'
            }
        case 'sent':
            return {
                class: 'bg-primary-500 text-white',
                name: 'Отправлен'
            }
        case 'done':
            return {
                class: 'bg-positive text-white',
                name: 'Выполнен'
            }
        case 'rejected':
            return {
                class: 'bg-destructive text-white',
                name: 'Отменён'
            }
    }
})
</script>