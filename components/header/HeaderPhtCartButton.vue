<template>
	<button @click="cart_is_visible = true" class="cart_button content_box flex items-center py-1 px-2">
		<vue-feather type="shopping-cart" size="17" class="text-primary me-2" />
		<div class="cart_button__meta hidden d-md-block">
			<p class="mb-0 font-bold cart_button__price text-sm text-start">{{summ}} ₽</p>
			<p class="mb-0 text-sub cart_button__count">{{count}} фото</p>
		</div>
	</button>
	<PhtCart
		:visible="cart_is_visible"
		@hide="cart_is_visible = false" />
</template>

<script>
import PhtCart from '../offcanvases/PhtCart'
export default {
    data(){
        return {
            cart_is_visible: false
        }
    },
    computed: {
        summ(){
            return this.$store.getters['photobank/getCartSumm'];
        },
        count(){
            return this.$store.getters['photobank/getCartCount'];
        },
        CART_ITEMS(){
            return this.$store.getters['photobank/getCartItems'];
        }
    },
    watch: {
        count(val){
            if(val > 0){
                this.$store.dispatch('photobank/fetchCartPhotos')
            }
        }
    },
    async mounted() {
		if(this.count > 0 && _.isEmpty(this.CART_ITEMS)){
			await this.$store.dispatch('photobank/fetchCartPhotos')
		}
        await this.$store.dispatch('photobank/fetchPayedPhotosIds')
	},
    components: {
        PhtCart,
    }
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
