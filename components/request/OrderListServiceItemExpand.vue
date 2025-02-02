<template>
    <div class="expand_cont p-3 border rounded">
        <div v-if="athlete" class="flex items-center gap-4">
            <Avatar :src="athlete?.avatar" :name="athlete?.name" />
            <span class="font-bold">{{athlete.name}}</span>
        </div>
        <div v-if="distances.length" class="mt-3">
            <p class="text-sub">Для дистанций</p>
            <p v-for="(distance, i) in distances" :key="i">
                {{distance.name}}
            </p>
        </div>
    </div>
</template>

<script setup>
import Avatar from '../UI/Avatar'

const props = defineProps({
    items: {
        type: Array,
        required: true
    },
    postData: {
        type: Object,
        required: true
    }
})

const athleteStore = useAthleteStore()

const athlete = computed(() => {
    return athleteStore.athletes.find(item => item.id === props.items[0]?.athlete_id)
})

const distances = computed(() => {
    return props.items.map(item => {
        if(!item.distance_id) return
        return props.postData.distances.find(distance => distance.id === item.distance_id)
    }).filter(item => !!item)
})
</script>

<style scoped>
    .expand_cont:last-child{
        margin-bottom: 0 !important;
    }
</style>