<template>
	<div class="shop_filter__section shop_filter__section--active_filters">
		<p v-if="title" class="font-oswald uppercase font-bold text-sub">
			{{ title }}
		</p>

		<ul class="filter_items_values p-0 m-0 mt-3">
			<li v-for="(item, i) in filter_data" :key="i" class="last:!mb-0">
				<a
					@click.prevent="setItem(item.id)"
					class="d-inline-block"
					:class="{
                        'font-bold text-primary': item.id === model
					}"
					href="javascript:void(0);"
					>{{ item.name }}</a
				>
<!--				<ul v-if="item.childs && item.childs.length" class="sub_filter_items_values">
					<li v-for="(child, n) in item.childs" :key="n">
						<a
							class="d-inline-block"
                            :class="child.name == selected ? 'font-bold text-primary' : ''"
							@click.prevent="setQuery(child.name)"
							href="javascript:void(0);"
							>{{ child.name }}</a
						>
					</li>
				</ul>-->
			</li>
		</ul>
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

function setItem(id){
    if(model.value === id){
        model.value = null
        return
    }
    model.value = id
}
</script>

<style>
.shop_filter__section ul.filter_items_values,
.shop_filter__section ul.sub_filter_items_values {
	list-style: none;
}

.shop_filter__section ul.filter_items_values li {
	margin-bottom: 15px;
}

.shop_filter__section ul.sub_filter_items_values {
	margin-top: 15px;
}

.shop_filter__section ul.filter_items_values a {
	transition: all 0.4s;
	opacity: 1;
}

.shop_filter__section ul.sub_filter_items_values li a {
	color: #828282;
	text-decoration: none;
}

.shop_filter__section ul.filter_items_values > li > a {
	color: #000;
	text-decoration: none;
}

.shop_filter__section ul.filter_items_values li a.active {
	font-weight: bold;
	color: #0057ff;
}

.shop_filter__section ul.filter_items_values li a:not(.active):hover {
	opacity: 0.5;
}
</style>
