<template>
    <Sheet v-model:open="isOpenedCart">
        <SheetTrigger as-child>
            <Button variant="white" class="md:py-1 md:px-2 h-auto" :class="className">
                <Icon name="ri:shopping-cart-line" class="text-primary-500" />
                <div class="cart_button__meta hidden md:block">
                    <p class="font-bold text-primary-500 text-sm text-start">{{ shopStore.summ }} ₽</p>
                    <p class="text-sub font-normal lowercase font-sans text-xs">{{ countText }}</p>
                </div>
            </Button>
        </SheetTrigger>

        <SheetContent class="min-w-full md:min-w-[500px]">
            <p class="section_title_medium mb-3">Корзина</p>
            <template v-if="shopStore.cart?.length">
                <div  class="cart_items mb-4">
                    <ShopCartItem
                        v-for="(item, i) in shopStore.cart"
                        :key="i"
                        :item="item"
                        deleteBtn
                    />
                </div>

                <div class="cart_summ flex items-center justify-between font-bold py-4">
                    <p>Итого:</p>
                    <p class="text-positive">{{shopStore.summ}} ₽</p>
                </div>

                <Button variant="primary" size="lg" class="w-full uppercase py-4" @click.prevent="toCheckout">Оформить заказ</Button>
            </template>
            <div v-else class="text-sub text-center h-[90%] flex flex-col items-center justify-center">
                <img src="/img/table_no_content.svg" class="w-full">
                <p class="font-oswald font-bold text-xl uppercase">Корзина пока пуста</p>
            </div>
        </SheetContent>
    </Sheet>
</template>

<script setup>
import { ref, computed } from 'vue'
import { pluralize } from '@/helpers/pluralize'
import {Sheet, SheetContent, SheetTrigger} from "~/components/shadcn/ui/sheet";
import {Button} from "~/components/shadcn/ui/button";
import ShopCartItem from "~/components/UI/ShopCartItem.vue";

const props = defineProps({
    className: {
        type: String,
        default: null
    },
    direct_checkout: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['onCheckout'])
const shopStore = useShopStore()
const isOpenedCart = ref(false)

const countText = computed(() => pluralize(shopStore.itemsCount, ['товар', 'товара', 'товаров']))

function toCheckout(){
    isOpenedCart.value = false
    navigateTo({name: 'shop_checkout'})
}
</script>

<style>
.cart_button {
    border: none;
    transition: all 0.2s;
}
.cart_button:hover {
    box-shadow: 0 1px 5px rgb(0 0 0 / 3%);
}
.cart_button__count {
    font-size: 12px;
}
</style>