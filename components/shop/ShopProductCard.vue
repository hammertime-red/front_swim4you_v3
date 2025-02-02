<template>
    <NuxtLink
            :to="{name: 'shop_product', params: {slug: item.slug}}"
            class="shop_product_card h-full flex flex-col text-decoration-none group rounded"
    >
        <div class="title_row flex justify-between items-start p-3">
            <div class="product_title">
                <h3 class="fs-6 font-oswald uppercase text-dark font-bold mb-1">{{ item.name }}</h3>
                <p class="text-sub mb-0">{{ item.shop_category_name }}</p>
            </div>
            <div
                    v-if="props.item?.discount && props.item.discount > 0"
                    class="product_discount text-white font-oswald font-bold bg-destructive py-1 px-2 ms-3 -mr-5 rounded-md"
            >
                -{{ props.item.discount }}%
            </div>
        </div>

        <div class="product_card_image relative overflow-hidden">
            <div class="aspect-square w-full">
                <img :src="props.item.thumbnail" />
            </div>
            <template v-if="!isMobile && item.in_stock">
                <Button v-if="item.is_variable" variant="primary" size="lg" class="hidden group-hover:flex absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
                    <Icon name="ri:grid-fill" />
                    Выбрать вариант
                </Button>
                <Button v-else variant="primary" size="lg" @click.prevent.stop="shopStore.addToCart(item.skus[0])" class="hidden group-hover:flex absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
                    <Icon :name="inCart ? 'ri:add-large-line' : 'ri:shopping-cart-line'" />
                    {{ inCart ? 'Добавить еще' : 'В корзину'}}
                </Button>
            </template>
        </div>

        <div class="price_row p-3 pt-2 mt-auto">
            <template v-if="item.in_stock">
                <p v-if="props.item.old_price" class="price_old mb-none text-sub text-sm mb-0">
                    <del>{{ props.item.old_price }} ₽</del>
                </p>
                <p class="text-primary-500 font-oswald font-bold text-xl">
                    {{ price }} ₽
                </p>

                <div v-if="isMobile" class="mob_button_cont mt-3">
                    <Button v-if="item.is_variable" variant="primary" size="lg" class="w-full">
                        <Icon name="ri:grid-fill" />
                        Выбрать вариант
                    </Button>
                    <Button v-else variant="primary" size="lg" @click.prevent.stop="shopStore.addToCart(item.skus[0])" class="w-full">
                        <Icon :name="inCart ? 'ri:add-large-line' : 'ri:shopping-cart-line'" />
                        {{ inCart ? 'Добавить еще' : 'В корзину'}}
                    </Button>
                </div>
            </template>
            <div v-else class="bg-destructive p-2 font-oswald uppercase text-white text-center font-bold mt-2">
                Временно нет в продаже
            </div>
        </div>
    </NuxtLink>
</template>

<script setup>
import {Button} from "~/components/shadcn/ui/button";
import {useWindowSize} from "@vueuse/core";

const shopStore = useShopStore()
const router = useRouter()
const {width} = useWindowSize()
const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    disable_link: {
        type: Boolean,
        default: false
    }
})

const isMobile = computed(() => width.value < 768)
const inCart = computed(() => {
    return shopStore.cart.some(item => item.id === props.item.skus[0].id)
})
const price = computed(() => {
    if(!props.item.is_variable || props.item.min_price === props.item.max_price) return props.item.min_price;
    return props.item.min_price + ' - ' + props.item.max_price;
})

const onClick = (slug) => {
    if(props.disable_link || !props.item.in_stock) return
    router.push({ name: 'product_page', params: { product: slug } })
}

const addToCart = () => {
    let cart_item = props.item
    cart_item.quantity = 1
    //store.commit('shop/addToCart', cart_item)
    document.querySelector('#btn__shop_cart').click()
}

const onProduct = () => {
    router.push({ name: 'product_page', params: { product: props.item.slug } })
}
</script>

<style>
.shop_product_card {
    background: #fff;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.4s;
    cursor: pointer;
}

.shop_product_card .product_card_image img {
    transition: all 0.4s;
    transform: scale(1);
}

.shop_product_card:hover {
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
}

.shop_product_card:hover .product_card_image img {
    transform: scale(1.05);
    opacity: 0.3;
}

.product_card_image .btn {
    width: calc(100% - 40px);
    display: none;
    transition: all .4s;
    border-radius: 0;
}

.shop_product_card:hover .product_card_image .btn {
    display: block;
}

.grayscale {
    filter: grayscale(100%);
}
</style>