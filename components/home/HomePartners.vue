<template>
<div class="container">
    <div class="big_title flex justify-between items-center gap-4">
        <h2 class="section_title mb-3 mb-md-0">{{ title }}</h2>
        <SliderNav @click-prev="swiperPrev" @click-next="swiperNext" />
    </div>
</div>
<div class="partners_carousel">
    <div class="container">
        <swiper :modules="modules" :spaceBetween="30" :loop="true" :slidesPerView="4" :breakpoints="this.swiper_breakpoints" :autoplay="true" ref="swiper_slider">
            <swiper-slide v-for="(item, i) in items" :key="i">
                <a :href="item.link" class="partners__item" target="_blank" rel="nofollow">
                    <img :src="item.image" />
                </a>
            </swiper-slide>
        </swiper>
    </div>
</div>
</template>

<script>
import {
    Swiper,
    SwiperSlide
} from "swiper/vue";
import {
    Autoplay
} from "swiper/modules";
import "swiper/css";
import SliderNav from "~/components/UI/SliderNav.vue";
export default {
    props: {
        items: {
            type: Array,
            required: true
        },
        title: {
            type: String,
            default: 'Партнеры'
        }
    },
    data() {
        return {
            swiper: null,
            swiper_breakpoints: {
                '0': {
                    slidesPerView: 2,
                },
                '1024': {
                    slidesPerView: 3,
                },
                '1200': {
                    slidesPerView: 4,
                },
            }
        };
    },
    setup() {
        return {
            modules: [Autoplay],
        };
    },
    mounted() {
        this.swiper = this.$refs.swiper_slider.$el.swiper
    },
    methods: {
        swiperPrev() {
            this.swiper.slidePrev();
        },
        swiperNext() {
            this.swiper.slideNext();
        },
    },
    components: {
        SliderNav,
        Swiper,
        SwiperSlide,
    },
}
</script>

<style>

</style>
