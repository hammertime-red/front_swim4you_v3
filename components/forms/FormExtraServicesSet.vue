<template>
	<div class="content_box px-4 py-6">
		<div
			class="content_box__header flex justify-between items-center mb-3 relative z-2">
			<h2 class="title_block mb-2">Выберите дополнительные услуги</h2>
		</div>
		<div class="upsells_form">
			<UpsellItem v-for="(item, i) in items" :key="i" :item="item" />
		</div>
		<div v-if="summ" class="upsells__summ text-end mt-4 font-bold text_20">
			<span>Итого: </span>
			<span class="text-positive">{{ summ }} ₽</span>
		</div>
	</div>
</template>

<script>
import UpsellItem from '../../components/forms/upsell/UpsellItem.vue'

export default {
	props: {
		items: {
			type: Array,
			default: [],
		},
	},
    inject: {
		extra_items: {
			from: 'extra_items',
			default: () => [],
		},
	},
	computed: {
		summ() {
			let summ = 0
            this.extra_items.forEach(extra_item => {
                let service = this.items.find(item => item.id == extra_item.extra_service_id)
                if(!service) return
                summ += service.price * extra_item.quantity
            })
			return summ
		},
	},
	components: { UpsellItem },
}
</script>

<style></style>
