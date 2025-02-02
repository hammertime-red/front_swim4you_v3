<template>
<NuxtLink :to="'/news/'+post.slug" class="card block relative">
    <img :src="postImage" class="card__img" />
    <div v-if="postDate" class="card__date text-sm flex items-center gap-2">
        <Icon name="ri:calendar-2-line" class="text-sub"/> {{ postDate }}
    </div>
    <div class="card__meta">
        <p v-if="post.category_name" class="w-fit bg-warning text-main font-bold font-oswald px-2 py-1.5 rounded-md mb-2">{{post.category_name}}</p>
        <p v-if="post.name" class="card_title_medium block text-decoration-none text-white mb-0">
            {{post.name}}
        </p>
    </div>
    <div class="card__meta__overlay"></div>
</NuxtLink>
</template>

<script setup>
import moment from "moment-timezone";
import {computed} from "vue";

const props = defineProps({
    post: {
        type: Object,
        required: true,
    },
    big_img: {
        type: Boolean,
        default: false
    },
})

const postDate = computed(() => {
    const date = props.post.date || props.post.created_at
    return formatDate(date,'d MMM yyyy')
})

const postImage = computed(() => {
    return props.big_img ? props.post.card_image_lg : props.post.card_image_sm
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
