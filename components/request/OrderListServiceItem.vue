<template>
	<template v-if="service">
		<div
			v-if="service.type == 'for_athletes' || service.type == 'for_distances'"
			class="grid gap-3 bg-slate-100 px-3 py-3 rounded-lg">
			<div class="flex justify-between items-center w-full">
				<p class="product_name font-bold mb-0">{{ service.display_name }}</p>
				<p class="price text-positive font-bold mb-0">
					{{ items.length }} x {{ service.price }} ₽
				</p>
			</div>
			<OrderListServiceItemExpand
				v-for="(elem, i) in itemsGroupByAthleteId"
				:key="i"
				:items="elem"
                :post-data="postData"
            />
		</div>
		<div v-else class="bg-slate-100 px-3 py-3 rounded-lg flex justify-between items-center">
			<p class="product_name font-bold mb-0">{{ service.display_name }}</p>
			<p class="price text-positive font-bold mb-0">
				{{ items[0].quantity }} x {{ service.price }} ₽
			</p>
		</div>
	</template>
</template>

<script setup>
import OrderListServiceItemExpand from './OrderListServiceItemExpand'
import { mapGetters } from 'vuex'

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
    postData: {
        type: Object,
        required: true
    }
})

const service = computed(() => {
    return props.postData.extra_services.find(item => item.id == props.items[0].extra_service_id)
})

const itemsGroupByAthleteId = computed(() => {
    return useChain(props.items)
        .groupBy(item => {
            return `${item.athlete_id}`
        })
})
</script>
