<template>
	<div
		class="cart_item flex items-center justify-between rounded p-2 mb-2">
		<div class="cart_item__left flex items-center me-3">
			<div class="cart_item__img rounded me-2 overflow-hidden ratio ratio-1x1">
				<img :src="item.thumb" />
			</div>
			
			<div class="cart_item__title">
				<p class="small font-bold mb-0">Фото №{{item.id}}</p>
				<div v-if="item.tags" class="cart_item__tags text-sub">
					{{item.tags}}
				</div>
			</div>
		</div>
		<div class="cart_item__right flex items-center">
			<p class="cart_item__price font-bold text-positive mb-0 me-2">300 ₽</p>
			<button v-if="deleteBtn" @click="removeFromCart(item.id)" class="btn_dark_circle btn btn-circle text-sub">
				<vue-feather type="trash" />
			</button>
		</div>
	</div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            default: 1
        },
        deleteBtn: {
            type: Boolean,
            default: true
        }
    },
	methods: {
		removeFromCart(id){
			this.$store.commit('photobank/removeFromCart', id)
		}
	}
}
</script>

<style scoped>
.cart_item{
	background: rgba(255, 255, 255, 0.05);
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

.btn_dark_circle:hover{
	background: rgba(255, 255, 255, 0.05);
}

.cart_item__price{
	font-size: 18px;
}

@media(max-width: 768px){
    .cart_item__img {
        width: 30px;
        border-radius: 3px !important;
    }

    .cart_item__tags{
        display: none;
    }

    .cart_item__price{
        font-size: 14px;
    }
}
</style>
