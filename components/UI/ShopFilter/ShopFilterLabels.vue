<template>
	<div class="shop_filter__section shop_filter__section--price">
		<p v-if="title" class="font-oswald uppercase font-bold text-sub">
			{{ title }}
		</p>

		<div class="variation_swatcher flex flex-wrap gap-2 mt-3">
			<a
				v-for="(item, i) in filter_data"
				:key="i"
				@click.prevent="selectOption(item.id)"
				href="javascript:void(0);"
				class="p-3 rounded-sm inline-block text-decoration-none font-bold"
				:class="isSelected(item.id) ? 'bg-primary-500 text-white' : 'bg-white text-dark'"
				>{{ item.name }}</a
			>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
    filter_data: {
        type: Object,
        required: true,
    },
    title: {
        type: String,
        required: true,
    }
})

const model = defineModel()

function selectOption(id){
    if(model.value.includes(id)){
        model.value = model.value.filter(item => item !== id)
    } else {
        model.value.push(id)
    }
}

function isSelected(id){
    return model.value.includes(id)
}
</script>

<style scoped>
.variation_swatcher a {
	transition: all 0.4s;
	opacity: 1;
}

.variation_swatcher a:hover {
	opacity: 0.5;
}
</style>
