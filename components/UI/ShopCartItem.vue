<template>
	<div
		class="cart_item flex items-center justify-between p-2 mb-2 rounded-md">
		<div class="cart_item__left flex items-center me-3">
			<div class="cart_item__img me-2 overflow-hidden aspect-square rounded-md">
				<img :src="item.thumbnail" />
			</div>

            <p class="font-bold text-xs md:text-sm">{{item.name}}</p>
		</div>
		<div class="cart_item__right flex items-center gap-3">
            <NumberField v-if="qtyField" v-model="quantity" :min="1" :step="1" class="max-w-[90px]">
                <NumberFieldContent>
                    <NumberFieldDecrement class="h-full" />
                    <NumberFieldInput class="h-full !my-0" />
                    <NumberFieldIncrement class="h-full" />
                </NumberFieldContent>
            </NumberField>
			<span v-else class="text-end text-sub text-sm" style="white-space: nowrap;" >
				{{item.quantity}} шт.
			</span>
			<p class="font-bold text-positive mb-0" style="white-space: nowrap;">{{item.price * item.quantity}} ₽</p>
			<Button v-if="deleteBtn" variant="ghost" size="icon" @click="shopStore.removeFromCart(item.id)" class="text-sub rounded-full">
                <Icon name="ri:delete-bin-5-line" />
			</Button>
		</div>
	</div>
</template>

<script setup>
import {
    NumberField, NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput
} from "~/components/shadcn/ui/number-field";
import {Button} from "~/components/shadcn/ui/button";

const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    deleteBtn: {
        type: Boolean,
        default: true
    },
    qtyField: {
        type: Boolean,
        default: true
    }
})

const shopStore = useShopStore()
const quantity = ref(1)

onMounted(()=> {
    if(quantity.value === props.item.quantity) return
    quantity.value = props.item.quantity
})

watch(() => props.item, () => {
    if(quantity.value === props.item.quantity) return
    quantity.value = props.item.quantity
})

watch(quantity, () => {
    if(quantity.value === props.item.quantity) return
    shopStore.changeQuantity(props.item.id, quantity.value)
})


</script>

<style scoped>
.cart_item{
	background: #F5F6FA;
}
.cart_item__img {
	width: 60px;
}

.cart_item__img img{
	object-fit: cover;
	min-width: 100%;
	min-height: 100%;
}

.cart_item__tags{
	max-width: 220px;
	font-size: 12px;
}

.cart_item__price{
	font-size: 18px;
}

@media(max-width: 768px){
    .cart_item__img {
        width: 30px;
        border-radius: 3px !important;
    }

    .cart_item__price{
        font-size: 14px;
    }
}
</style>
