<template>
<div class="athlet_box h-full flex flex-col justify-between">
    <div class="text-center pt-4 px-4 py-0 relative">
        <div class="athlet_box__top__overlay"></div>
        <div class="relative">
            <p class="text_lg text-sub mb-2">{{item.distance}} - {{item.stroke_name}}</p>
            <div class="">
                <Avatar :src="item.avatar" :name="item.athlete_name" :size="'lg'" class="mx-auto border-4 border-white shadow-lg" />
            </div>
            <div class="mx-auto w-7 h-7 rounded-full border-4 border-white overflow-hidden flex items-center justify-center -mt-4 shadow-md">
                <Icon v-if="flag" :name="`circle-flags:${flag}`" size="24"/>
            </div>
            <p class="text-sub text-sm uppercase mt-1">{{item.club_nation}}, {{item.club_code}}</p>
        </div>
    </div>
    <div class="athlet_box__content p-2 text-center h-full flex flex-col justify-between">
        <div class="top mb-2">
            <NuxtLink v-if="has_link" :to="{name: 'athlete', params: {id: item.athlete_id}}" class="font-bold text-lg">{{item.athlete_name}}</NuxtLink>
            <p v-else class="font-bold text-lg">{{item.athlete_name}}</p>
            <p class="font-bold text-sm text-sub ">{{item.club_name}}</p>
        </div>
        <div class="bottom">
            <p class="font-oswald text-accent font-bold text-3xl mb-2">{{formatSwimtime(item.formatted_swimtime)}}</p>
            <p class="text-sub text-sm">{{item.meet_name}}</p>
            <p class="text-sub text-sm">{{formatDate(item.session_date, 'd MMMM yyyy')}}</p>
        </div>
    </div>
</div>
</template>

<script setup>
import Avatar from '../UI/Avatar'
const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    has_link: {
        type: Boolean,
        default: false
    }
})

const flag = computed(() => {
    switch (props.item.club_nation){
        case 'RUS':
            return 'ru';
        case 'KAZ':
            return 'kz';
        case 'BEL':
            return 'by';
        default:
            return null
    }
})
</script>

<style>

</style>
