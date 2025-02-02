<template>
	<div class="dark_cart">
	<OffcanvasInline
		id="pht_cart"
		@hide="$emit('hide'), (visible = !visible)"
		:visible="visible">
		<p class="section_title_medium mb-3">Корзина</p>
		<template v-if="existItems">
		<div  class="cart_items mb-4">
			<PhtCartItem 
				v-for="(item, i) in getCartItems"
				:key="i"
				:item="item"
				:deleteBtn="true"
				:index="i" />
		</div>
		
		<div class="cart_summ flex items-center justify-between font-bold py-4">
			<p>Итого:</p>
			<p class="text-positive">{{summ}} ₽</p>
		</div>

		<NuxtLink
		@click="$emit('hide'), (visible = !visible)"
		:to="{name: 'photobank_checkout'}"
		class="btn btn-lg btn-primary btn-primary-shadow rounded-pill w-full uppercase"
		>Оформить заказ</NuxtLink>
		</template>
		<div v-else class="fs-3 py-3 text-sub text-center">
			<img src="/img/table_no_content.svg" class="w-full">
			<div>Корзина пока пуста</div>
    	</div>
		

	</OffcanvasInline>
	</div>
</template>

<script>
import PhtCartItem from '../cards/PhtCartItem'
import OffcanvasInline from './OffcanvasInline.vue'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {}
	},
	created(){
		this.subscribeMutations()
		this.setLocalStorageCart()
	},
	computed: {
		getCartItems(){
			return this.$store.getters['photobank/getCartItems']
		},
		summ(){
            return this.$store.getters['photobank/getCartSumm'];
        },
		existItems(){
			if(!_.isEmpty(this.getCartItems)) return true
			return
		},
	},
	methods: {
		subscribeMutations(){
			this.$store.subscribe(mutation => {
				if (mutation.type.startsWith('photobank')){
					if(mutation.type != 'photobank/setCart'){
						this.$store.dispatch('photobank/changeLocalStorage')
					}
				}
			})
		},
		setLocalStorageCart(){
			this.$store.commit('photobank/setCart')
		}
	},
	components: {
    PhtCartItem,
		OffcanvasInline,
	},
	emits: ['changeData'],
}
</script>

<style scoped>
.cart_summ{
	border-top: 1px solid rgba(255, 255, 255, 0.08);
	font-size: 24px;
}
</style>
