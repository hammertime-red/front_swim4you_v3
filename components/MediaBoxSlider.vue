<template>
    <div class="media_box content_box">
        <Carousel
                :plugins="[Autoplay({
                delay: 5000,
                stopOnInteraction: true,
                stopOnMouseEnter: true,
            })]">
            <div class="flex justify-between gap-4 items-center mb-4">
                <p class="media_box__title">{{ title }}</p>
                <div class="flex gap-3">
                    <CarouselPrevious variant="outline" size="icon" class="relative translate-y-0 right-auto left-auto top-auto bottom-auto rounded-full border-2 text-slate-400 border-slate-400 bg-transparent hover:bg-transparent hover:border-primary-500 hover:text-primary-500 disabled:opacity-10">
                        <Icon name="ri:arrow-left-line" size="28px" />
                    </CarouselPrevious>
                    <CarouselNext variant="outline" size="icon" class="relative translate-y-0 right-auto left-auto top-auto bottom-auto rounded-full border-2 text-slate-400 border-slate-400 bg-transparent hover:bg-transparent hover:border-primary-500 hover:text-primary-500 disabled:opacity-10">
                        <Icon name="ri:arrow-right-line" size="28px" />
                    </CarouselNext>
                </div>
            </div>
            <CarouselContent>
                <CarouselItem v-for="(item, i) in items">
                    <MediaCard :item="item" :type="type" class="ratio_4x3"/>
                </CarouselItem>
            </CarouselContent>
        </Carousel>

    </div>
</template>

<script setup>
import MediaCard from './cards/MediaCard'
import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "~/components/shadcn/ui/carousel";

const props = defineProps({
    items: {
        type: Array,
        default: () => []
    },
    title: {
        type: String,
    },
    type: {
        type: String,
    },
})

function swiperPrev() {
    console.log('swiperPrev')
}

function swiperNext() {
    console.log('swiperNext')
}
</script>

<style>

</style>
