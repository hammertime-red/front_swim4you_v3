<template>
<NuxtLink :to="'/media/' + item.slug" class="block card relative">
    <img :src="item.card_image" class="card__img" />
    <div v-if="postDate" class="card__date text-sm flex items-center gap-2 !bg-white">
        <Icon name="ri:calendar-2-line" class="text-sub"/> {{ postDate }}
    </div>
    <div class="card__meta">
        <div class="flex items-center mb-3">
            <span class="media_badge md:text-[34px]">
                <Icon v-if="item.type === 'video'" name="ri:file-video-line" />
                <Icon v-else name="ri:image-2-line" />
            </span>
            <span class="text-white font-bold ml-2 text-lg">{{ item.type === 'video' ? 'Видео' : 'Фото' }}</span>
        </div>
        
        <p v-if="item.event_name" class="text-decoration-none text-white uppercase mb-0 opacity-50 text-sm">
            {{item.event_name}}
        </p>
        <p v-if="item.name" class="card_title_medium block text-decoration-none text-white mb-2">
            {{item.name}}
        </p>
    </div>
    <div class="card__meta__overlay"></div>
</NuxtLink>
</template>

<script setup>
import {computed} from "vue";
import moment from "moment-timezone";

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
})

const postDate = computed(() => {
    const date = props.item.date || props.item.created_at
    return formatDate(date,'d MMM yyyy')
})
</script>

<style scoped>
    .card{
        height: 0;
        padding-bottom: 100%;
    }

    .card.card_sm_height{
        padding-bottom: calc(50% - 12px);
    }

    .ratio_4x3{
        padding-bottom: 75%;
    }

    @media(max-width: 768px){
        .card.card_sm_height{
            height: 0;
            padding-bottom: 100%;
        }

        .card__meta{
            padding: 1.75rem;
        }
    }

    .card img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        min-width: 100%;
        min-height: 100%;
    }

    .card:hover img{
        transform: translate(-50%, -50%) scale(1.05);
    }
</style>
