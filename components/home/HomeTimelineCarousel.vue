<template>
    <div class="container">
        <div class="big_title flex flex-wrap justify-between items-center gap-3">
            <h2 class="section_title mb-3 mb-md-0">{{ title }}</h2>
            <SliderNav @click-next="swiperNext" @click-prev="swiperPrev" />
        </div>
    </div>

    <div class="timeline_carousel">
        <div class="container">
            <Swiper ref="swiper_instance" :breakpoints="swiper_breakpoints" :slidesPerView="4" :spaceBetween="30"
                    @slideChange="swiperSlideChange">
                <SwiperSlide v-for="(item, i) in sortedResults" :key="i"
                              :class="active_item === i ? 'active' : ''">
                    <TimelineCarouselItem :post="item"/>
                </SwiperSlide>
            </Swiper>
            <div class="timeline_carousel__line"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TimelineCarouselItem from './TimelineCarouselItem'
import { Swiper, SwiperSlide } from "swiper/vue"
import "swiper/css"
import { Button } from "~/components/shadcn/ui/button"
import SliderNav from "~/components/UI/SliderNav.vue";
const props = defineProps({
    title: {
        type: String,
        default: 'Результаты'
    },
    items: {
        type: Array,
        required: true
    }
})

const swiper_instance = ref(null)
const swiper = ref(null)
const active_item = ref(0)
const swiper_breakpoints = ref({
    '0': {
        slidesPerView: 1,
    },
    '550': {
        slidesPerView: 2,
    },
    '1024': {
        slidesPerView: 3,
    },
    '1200': {
        slidesPerView: 4,
    },
})

const sortedResults = computed(() => {
    return props.items.sort((a, b) => b.timestamp_end_event_date - a.timestamp_end_event_date)
})

onMounted(() => {
    swiper.value = swiper_instance.value?.$el?.swiper
})

const swiperSlideChange = () => {
    active_item.value = swiper.value.realIndex
}

const swiperPrev = () => {
    swiper.value.slidePrev()
}

const swiperNext = () => {
    swiper.value.slideNext()
}
</script>

<style scoped>
.swiper {
    overflow: visible;
}

@media (max-width: 768px) {
    .swiper {
        overflow: hidden;
    }
}

.timeline_carousel {
    min-height: 180px;
}

</style>
