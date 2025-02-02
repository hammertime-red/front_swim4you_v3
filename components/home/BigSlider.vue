<template>
    <div class="big_image_carousel relative">
        <Carousel
            :plugins="[Autoplay({
              delay: 5000,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            })]"
            @init-api="setApi">
            <CarouselContent>
                <CarouselItem v-for="(item, i) in items">
                    <div class="relative overflow-hidden" :style="{ 'background-image': `url(${slideImage(item)})` }">
                        <div class="carousel-item__wrapper">
                            <div
                                v-if="item.content"
                                @click="slideLink(item.link)"
                                class="carousel-item__overflow"
                                :class="item?.link ? 'cursor-pointer' : ''"></div>
                                <div v-if="item.content" class="container h-full">
                                    <div class="flex gap-4 animated fadeInDown">
                                        <CarouselPrevious class="relative right-auto left-auto text-white border-3 border-white w-10 h-10 opacity-30 hover:opacity-100 bg-transparent hover:bg-transparent disabled:opacity-10">
                                            <Icon name="ri:arrow-left-line" size="28px" />
                                        </CarouselPrevious>
                                        <CarouselNext class="relative right-auto left-auto text-white border-3 border-white w-10 h-10 opacity-30 hover:opacity-100 bg-transparent hover:bg-transparent disabled:opacity-10">
                                            <Icon name="ri:arrow-right-line" size="28px" />
                                        </CarouselNext>
                                    </div>
                                    <div
                                        class="slide_content text-white animated fadeInUp"
                                        :class="item.link ? 'cursor-pointer' : ''"
                                        v-html="item.content" />
                                </div>
                        </div>
                    </div>
                </CarouselItem>
            </CarouselContent>
            <div class="carousel-indicators hidden lg:flex justify-center absolute bottom-0 w-full">
                <div
                    v-for="(item, i) in items"
                    :key="i"
                    class="pagination_bullet"
                    :class="{
                        'active': activeSlide === i
                    }"
                    @click="api.scrollTo(i)">
                    {{ item.name }}
                </div>
            </div>
        </Carousel>
	</div>
</template>

<script setup>
import 'swiper/css'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "~/components/shadcn/ui/carousel/index";
import Autoplay from 'embla-carousel-autoplay'
const props = defineProps({
    items: Array,
    required: true,
})

const api = ref(null)
const activeSlide = ref(0)
function setApi(val) {
    api.value = val
    api.value.on('slidesInView', logSlidesInView);
}

function logSlidesInView(emblaApi) {
    activeSlide.value = emblaApi.slidesInView()[0]
}

function slideImage(item) {
    if (window.innerWidth < 768) {
        return item.mobile_image
    } else {
        return item.image
    }
}

function slideLink(link) {
    if (!link) return false
    if (link.includes('http')) {
        location.href = link
    } else {
        this.$router.push(link)
    }
}
</script>

<style>
.slide_content{
    max-width: 835px;

    h2{
        font-family: "Oswald", sans-serif;
        font-size: 3.5rem;
        font-weight: 700;
        text-transform: uppercase;
        text-shadow: 0 4px 8px rgba(0, 0, 0, .5);

        @media(max-width: 1024px) {
            font-size: 3rem;
        }

        @media(max-width: 768px) {
            font-size: 2.3rem;
        }
    }

    p {
        margin-top: 20px;
        font-size: 20px;

        @media(max-width: 768px) {
            margin-top: 15px;
            font-size: 16px;
        }
    }
}
.big_image_carousel .carousel-item__wrapper {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-height: 650px;
}

.big_image_carousel .swiper-slide {
	background-size: cover;
	background-position: center center;
	background-repeat: no-repeat;
	position: relative;
}

.big_image_carousel .carousel-item__title {
	max-width: 835px;
	text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
	margin-bottom: 60px;
	text-decoration: none;
}

.big_image_carousel .carousel-item__overflow {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: linear-gradient(to right, rgba(0, 31, 141, 0.8) 30%, transparent);
}

.big_image_carousel .container {
	position: relative;
}

.big_image_carousel .carousel-nav button {
	opacity: 0.3;
	transition: opacity 0.4s;
	color: #fff;
}

.big_image_carousel .carousel-nav button:hover,
.big_image_carousel .carousel-nav button:focus {
	opacity: 0.5;
	color: #fff;
}

.big_image_carousel .carousel-indicators {
	margin: 0;
	background: linear-gradient(to top, #030c2f, transparent);
	padding: 1rem 0;
}

.big_image_carousel .carousel-indicators .pagination_bullet {
	box-sizing: content-box;
	flex: 0 1 auto;
	width: auto;
	height: auto;
	padding: 1rem;
	margin-right: 0;
	margin-left: 0;
	text-indent: inherit;
	cursor: pointer;
	background-color: transparent;
	background-clip: padding-box;
	border: 0;
	border-top: none;
	border-bottom: none;
	border-right: 1px solid rgba(255, 255, 255, 0.2);
	opacity: 0.4;
	transition: opacity 0.6s ease;
	color: #fff;
	max-width: 200px;
	cursor: pointer;
}

.big_image_carousel .carousel-indicators .pagination_bullet:last-child {
	border-right: none;
}

.big_image_carousel .carousel-indicators .pagination_bullet:hover,
.big_image_carousel .carousel-indicators .pagination_bullet.active {
	opacity: 1;
}

.carousel-nav {
	position: relative;
	display: flex;
	align-items: center;
}

.carousel-nav button {
	position: relative;
	width: auto;
	transition: all 0.4s;
	color: #071031;
}

.carousel-nav button:hover,
.carousel-nav button:focus {
	color: #005eff;
}

.carousel-nav button svg {
	width: 40px;
	height: 40px;
}

.cursor-pointer {
	cursor: pointer;
}
</style>
