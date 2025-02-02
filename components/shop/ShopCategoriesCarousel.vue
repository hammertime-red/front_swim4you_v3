<template>
  <div class="shop_categories_carousel">
    <div class="container">
        <swiper :modules="modules" :autoplay="true" :slidesPerView="6" :spaceBetween="30" ref="swiper_slider" :breakpoints="this.swiper_breakpoints" :loop="true">
            <swiper-slide @click="onClick(item.id)" v-for="(item, i) in items" :key="i" class="text-center slide">
                <img v-if="item.thumbnail" :src="item.thumbnail" class="mb-3">
                <p v-if="item.name" class="title font-oswald font-bold uppercase mb-1">{{item.name}}</p>
                <p v-if="item.count && item.count > 0" class="text-sub">{{countProducts(item.count, ['товар', 'товара', 'товаров'])}}</p>
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
import { Autoplay } from 'swiper/modules';
import "swiper/css";
import "swiper/css/autoplay";
import {pluralize} from '@/helpers/pluralize'
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
                    slidesPerView: 2,
                },
                '550': {
                    slidesPerView: 3,
                },
                '768': {
                    slidesPerView: 4,
                },
                '1024': {
                    slidesPerView: 5,
                },
                '1200': {
                    slidesPerView: 6,
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
        countProducts(count, text_arr){
            return pluralize(count, text_arr)
        },
        onClick(id){
            this.$router.push({name: 'shop', query: {category: id}})
        }
    },
    components: {
        Swiper,
        SwiperSlide,
    }
}
</script>

<style>
.shop_categories_carousel .slide{
    cursor: pointer;
}
.shop_categories_carousel .slide img{
    max-width: 130px;
    max-height: 130px;
    border-radius: 100%;
    box-shadow: 0 40px 30px rgba(0,0,0,.1);
    transition: all .4s;
    transform: scale(1);
}

.shop_categories_carousel .slide:hover img{
    transform: scale(1.05);
}
</style>