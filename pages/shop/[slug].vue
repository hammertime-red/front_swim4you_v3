<template>
    <div v-if="productLoadingStatus === 'success'">
        <div class="container mt-12 mb-7">
            <div class="grid grid-cols-3 gap-7">
                <div class="col-span-3 lg:col-span-2">
                    <div class="flex gap-4 md:flex-row flex-col w-full">
                        <div class="hidden md:block w-24">
                            <div class="h-[400px] overflow-hidden">
                                <Carousel
                                        @init-api="(val) => thumbCarousel = val"
                                        class="h-full"
                                        orientation="vertical"
                                >
                                    <CarouselContent class="-mt-2">
                                        <CarouselItem
                                            v-for="(image, index) in productData.gallery"
                                            :key="index"
                                            class="pt-2 cursor-pointer"
                                        >
                                            <div
                                                :class="[
                                                     'h-24 w-full overflow-hidden rounded-lg border-3',
                                                     selectedIndex === index ? 'border-primary-50' : 'border-transparent'
                                                   ]"
                                                @click="onThumbClick(index)"
                                            >
                                                <img
                                                    :src="image.thumbnail"
                                                    class="h-full w-full object-cover"
                                                />
                                            </div>
                                        </CarouselItem>
                                    </CarouselContent>
                                </Carousel>
                            </div>
                        </div>

                        <div class="flex-1 relative">
                            <Carousel
                                @init-api="(val) => mainCarousel = val"
                                class="w-full"
                                @select="onMainSelect"
                            >
                                <CarouselContent>
                                    <CarouselItem
                                        v-for="(image, index) in productData.gallery"
                                        :key="index"
                                    >
                                        <div class="aspect-square overflow-hidden rounded-lg">
                                            <img
                                                :src="image.lg"
                                                class="h-full w-full object-cover"
                                            />
                                        </div>
                                    </CarouselItem>
                                </CarouselContent>
                                <div class="absolute inset-0 flex items-center justify-between p-4">
                                    <CarouselPrevious class="relative right-auto left-0 text-primary-500 hover:text-primary-500 border-3 border-primary-500 w-10 h-10 opacity-30 hover:opacity-100 bg-transparent hover:bg-transparent disabled:opacity-10">
                                        <Icon name="ri:arrow-left-line" size="28px" />
                                    </CarouselPrevious>
                                    <CarouselNext class="relative right-0 left-auto text-primary-500 hover:text-primary-500 border-3 border-primary-500 w-10 h-10 opacity-30 hover:opacity-100 bg-transparent hover:bg-transparent disabled:opacity-10">
                                        <Icon name="ri:arrow-right-line" size="28px" />
                                    </CarouselNext>
                                </div>
                            </Carousel>
                        </div>
                    </div>
                </div>
                <div class="col-span-3 lg:col-span-1">
                    <p v-if="productData.shop_category.name" class="mb-2 text-lg text-sub uppercase">{{productData.shop_category.name}}</p>
                    <h1 class="text-3xl uppercase font-oswald font-bold mb-4">
                        {{productData.name}}
                    </h1>

                    <div class="flex align-items-end mb-3">
                        <div class="prices">
                            <p v-if="productData.old_price" class="old_price mb-0 text-sub text-decoration-line-through">
                                {{productData.old_price}} ₽
                            </p>
                            <p v-if="productData.min_price" class="price_current mb-0 text-primary-500 font-oswald font-bold text-3xl">
                                {{priceText}} ₽
                            </p>
                        </div>
                        <div
                                v-if="productData.discount"
                                class="product_discount text-white font-oswald font-bold bg-destructive py-2 px-3 ms-4 rounded-md">
                            -{{productData.discount}}%
                        </div>
                    </div>

                    <p v-if="productData.short_description" class="text-sub mb-4">
                        {{productData.short_description}}
                    </p>

                    <div
                            v-if="productData.in_stock"
                            class="product_stock w-fit text-white font-oswald uppercase font-bold bg-positive py-2 px-3 mb-5">
                        В наличии
                    </div>
                    <div
                            v-else
                            class="product_stock w-fit text-white font-oswald uppercase font-bold bg-destructive py-2 px-3 mb-5">
                        Нет в наличии
                    </div>

                    <div v-if="productData.is_variable && productData.in_stock" class="variation_swatcher mb-4">
                        <ShopVariationSwatcher :variations="productData.variations" @selectVariation="selectVariation" @select="selectedVariation = null" />
                    </div>

                    <div v-if="productData.is_variable && selectedVariation" class="flex align-items-end mb-3">
                        <div v-if="selectedVariation.price" class="prices">
                            <p class="price_current mb-0 text-primary font-oswald font-bold fs-2">
                                {{selectedVariation.price}} ₽
                            </p>
                        </div>
                        <div
                                v-if="selectedVariation.discount"
                                class="product_discount text-white font-oswald font-bold bg-destructive py-2 px-3 ms-4">
                            -{{selectedVariation.discount}}%
                        </div>
                    </div>

                    <div v-if="productData.in_stock" class="grid grid-cols-3 gap-4">
                        <NumberField v-model="quantity" :min="1" :step="1" class="col-span-3 md:col-span-1">
                            <NumberFieldContent>
                                <NumberFieldDecrement class="h-full" />
                                <NumberFieldInput class="h-full !my-0" />
                                <NumberFieldIncrement class="h-full" />
                            </NumberFieldContent>
                        </NumberField>
                        
                        <Button variant="primary" size="lg" :disabled="!selectedVariation" @click.prevent.stop="shopStore.addToCart(selectedVariation, quantity)" class="col-span-3 md:col-span-2">
                            <Icon :name="inCart ? 'ri:add-large-line' : 'ri:shopping-cart-line'" />
                            {{ inCart ? 'Добавить еще' : 'В корзину'}}
                        </Button>
                    </div>

                </div>
            </div>
        </div>
        <div class="mt-5 bg-white py-5 mb-7">
            <div class="container">
                <div class="grid lg:grid-cols-2 gap-4">
                    <div v-if="productData.description" class="col-md-6">
                        <p class="text-3xl font-bold uppercase font-oswald mb-4">Описание</p>
                        <div class="page_content text-sub" v-html="productData.description">
                        </div>
                    </div>
                    <div v-if="productData.notes" class="col-md-6">
                        <p class="text-3xl font-bold uppercase font-oswald mb-4">Особенности:</p>
                        <div class="page_content text-sub" v-html="productData.notes">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="productData?.related_products?.length" class="container">
            <p class="section_title mb-5">Похожие товары</p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                <ShopProductCard v-for="item in productData?.related_products" :item="item" />
            </div>
        </div>
    </div>
</template>

<script setup>
import ShopVariationSwatcher from '~/components/UI/ShopVariationSwatcher'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from '~/components/shadcn/ui/carousel'
import {watchOnce} from "@vueuse/core";
import {NumberField, NumberFieldContent, NumberFieldInput, NumberFieldIncrement, NumberFieldDecrement} from "~/components/shadcn/ui/number-field";
import {Button} from "~/components/shadcn/ui/button";
import ShopProductCard from "~/components/shop/ShopProductCard.vue";

definePageMeta({
    name: 'shop_product'
})

const shopStore = useShopStore()
const route = useRoute()

const {data: productData, status: productLoadingStatus} = useAsyncData(`shop_product_${route.params.slug}`, () => getProductData())

async function getProductData() {
    return await fetchData(`/shop/products/${route.params.slug}`, {
        method: 'GET',
    })
        .then(res => res)
        .catch(err => console.error(err))
}

const selectedIndex = ref(0)
const mainCarousel = ref(null)
const thumbCarousel = ref(null)

const onMainSelect = () => {
    if (!mainCarousel.value || !thumbCarousel.value) return
    selectedIndex.value = mainCarousel.value.selectedScrollSnap()
    thumbCarousel.value?.scrollTo(selectedIndex.value)
}

const onThumbClick = (index) => {
    if (!mainCarousel.value || !thumbCarousel.value) return
    selectedIndex.value = index
    mainCarousel.value.scrollTo(index)
}

watchOnce(mainCarousel, (mainCarousel) => {
    if (!mainCarousel)
        return

    onMainSelect()
    mainCarousel.on('select', onMainSelect)
    mainCarousel.on('reInit', onMainSelect)
})

const selectedVariation = ref(null)
const quantity = ref(1)

watch(productData, (value) => {
    if(!value.is_variable){
        selectedVariation.value = value.skus[0]
    }
})

const inCart = computed(() => {
    return shopStore.cart.some(item => item.id === selectedVariation.value.id)
})

const priceText = computed(() => {
    let price = ''
    if(productData.value.min_price) price += productData.value.min_price
    if(productData.value.max_price && productData.value.max_price != productData.value.min_price) {
        price = price + ' - ' + productData.value.max_price
    }
    return price
})

const selectVariation = (val) => {
    selectedVariation.value = productData.value.skus.find(item => item.size == val.size && item.color == val.color) || null
}

const onCart = () => {
    if(disableCartBtn.value) return
    let cart_item = {
        id: productData.value.id,
        name: productData.value.name,
        thumbnail: productData.value.thumbnail,
        variation: null,
        price: productData.value.price,
        quantity: quantity.value,
    }

    if(selectedVariation.value){
        cart_item.name = productData.value.name + ', ' + selectedVariationSuffix.value
        cart_item.variation = selectedVariation.value
        cart_item.price = selectedVariation.value.price
        cart_item.sku = selectedVariation.value?.sku
    }

    store.commit('shop/addToCart', cart_item)
    $swal('Товар добавлен в корзину', '', 'success')
}

</script>

<style scoped>
.background_container {
    background: #f5f6fa;
}
.product_slider_thumb .swiper-slide {
    opacity: 0.4;
}

.product_slider_thumb .swiper-slide-thumb-active {
    opacity: 1;
}
</style>