<template>
  <section class="shop_banners_section">
    <div class="container mb-4">
        <div class="row g-4 items-center">
            <div class="col-md-10">
                <p class="section_title">Коллекции с последних соревнований</p>
            </div>
            <div class="col-md-2">
                <div class="carousel-nav mb-3 justify-content-start justify-content-md-end">
                    <button @click="swiperPrev()" class="carousel-control-prev me-3">
                        <vue-feather type="arrow-left-circle"></vue-feather>
                    </button>
                    <button @click="swiperNext()" class="carousel-control-next">
                        <vue-feather type="arrow-right-circle"></vue-feather>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="shop_banners__carousel">
        <swiper :modules="modules" :autoplay="true" :slidesPerView="6" :spaceBetween="30" ref="swiper_slider" :breakpoints="this.swiper_breakpoints" :loop="true">
            <swiper-slide v-for="(item, i) in items" :key="i" class="slide">
                <a :href="item.link">
                    <img v-if="item.image" :src="item.image">
                </a>
            </swiper-slide>
        </swiper>
    </div>
  </section>
</template>

<script>
import {
    Swiper,
    SwiperSlide
} from "swiper/vue";
import { Autoplay } from 'swiper/modules';
import "swiper/css";
import "swiper/css/autoplay";
export default {
    props: {
        items: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            swiper: null,
            swiper_breakpoints: {
                '0': {
                    slidesPerView: 1,
                },
                '1024': {
                    slidesPerView: 2,
                },
            },
        }
    },
    mounted() {
        this.swiper = this.$refs.swiper_slider.$el.swiper
    },
    setup() {
      return {
        modules: [Autoplay],
      };
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
        Swiper,
        SwiperSlide,
    }
}
</script>

<style scoped>
@media(min-width: 768px){
    .shop_banners_section .section_title{
        font-size: 60px;
    }
}

@media(min-width: 1200px){
    .shop_banners__carousel{
        padding: 0 50px;
    }
}

@media(max-width: 1200px){
    .shop_banners__carousel{
        padding: 0 15px;
    }
}

</style>