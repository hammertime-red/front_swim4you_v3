<template>
	<div class="shop_filter__section shop_filter__section--price">
		<p v-if="title" class="font-oswald uppercase font-bold text-sub">
			{{ title }}
		</p>

		<div class="filter_container flex flex-wrap gap-2 mt-3">
			<a
				v-for="(item, i) in filter_data"
				:key="i"
				href="javascript:void(0);"
				@click.prevent="selectOption(item.id)"
				class="inline-block text-decoration-none font-bold text-white rounded-md"
				:class="isSelected(item.id) ? 'active' : ''"
                :style="'background-color:' +  item.color"></a>
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
.filter_container a {
	transition: all 0.4s;
	opacity: 1;
	padding: 15px;
}

.filter_container a:hover {
	opacity: 0.5;
}

.filter_container a.active {
	box-shadow: 0 0 0 3px rgba(11, 93, 215, 0.3);
}

.bg-red {
	background: #f00;
}
.bg-orange {
	background: #ff9900;
}
.bg-yellow {
	background: #ffd600;
}
.bg-green {
	background: #0b8600;
}
.bg-blue {
	background: #00d1ff;
}
.bg-darkblue {
	background: #0066ff;
}
.bg-purple {
	background: #7000ff;
}
</style>
