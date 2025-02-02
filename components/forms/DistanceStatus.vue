<template>
    <div
        class="badge uppercase font-bold font-oswald flex items-center justify-center p-2 rounded-md text-xs"
        :class="className"
    >{{statusName}}</div>
</template>

<script setup>
const props = defineProps({
    status: {
        type: String,
        default: 'not_reserved'
    },
    is_payed: {
        type: Boolean,
        default: false
    },
})

const statusName = computed(() => {
    if(props.is_payed) return 'Оплачено'
    switch (props.status) {
        case 'reserved': return 'Зарезервировано'
        case 'distance_full': return 'Нет мест в дистанции'
        case 'age_full': return 'Нет мест в возр. лимите'
        case 'draft': return 'Черновик'
        default: return 'Не зарезервировано'
    }
})

const className = computed(() => {
    if(props.is_payed) return 'bg-positive text-white'
    switch (props.status) {
        case 'reserved': return 'bg-primary-500 text-white'
        case 'distance_full': return 'bg-destructive text-white'
        case 'age_full': return 'bg-destructive text-white'
        case 'draft': return 'bg-secondary text-white'
        default: return 'bg-slate-200'
    }
})
</script>