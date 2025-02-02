<template>
    <div class="home_news_grid">
        <div class="container">
            <div class="grid md:grid-cols-2 gap-4">
                <NewsCard :post="items[0]" big_img />
                <div class="flex flex-col justify-between gap-4">
                    <div v-if="items[1]">
                        <NewsCard :post="items[1]" :class="'card_sm_height'" />
                    </div>
                    <div v-if="items[2]">
                        <NewsCard :post="items[2]" :class="'card_sm_height'" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import NewsCard from '../cards/NewsCard.vue'
import moment from 'moment'
import {useHomeStore} from "@/store/homeStore";

const props = defineProps({
    items: {
        type: Array,
        required: true
    }
})

</script>

<style>
</style>
