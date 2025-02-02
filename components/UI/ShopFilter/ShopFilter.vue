<template>
	<Button v-if="isMobile" variant="secondary" size="lg" class="w-full rounded-0 mb-2" @click.prevent="isFormOpened = !isFormOpened">{{isFormOpened ? 'Скрыть фильтры' : 'Показать фильтры'}}</Button>
	<transition name="slide">
	<div v-if="!isMobile || isFormOpened" class="shop_filter grid gap-6">
<!--		<ShopActiveFilters v-if="hasQuery" @removeFilter="removeFilter" class="mt-4 mb-4" />-->
		
        <ShopFilterSection
                v-if="filters?.shop_categories?.length"
                v-model="model.shop_category_id"
                :filter_data="filters.shop_categories"
                title="Категория" />
        
        <div v-if="filters?.shop_categories?.length" class="border-b"></div>
        
        <ShopFilterSection
                v-if="filters?.shop_collections?.length"
                v-model="model.shop_collection_id"
                :filter_data="filters.shop_collections"
                title="Коллекция" />

        <div v-if="filters?.shop_collections?.length" class="border-b"></div>

        <ShopFilterPrice
                v-if="filters?.prices?.min_price && filters?.prices?.max_price && filters?.prices?.min_price !== filters?.prices?.max_price"
                v-model:min="model.min_price"
                v-model:max="model.max_price"
                :min-limit="filters?.prices?.min_price"
                :max-limit="filters?.prices?.max_price"
                :filter_data="filters?.prices"
                title="Цена" />

        <div v-if="filters?.prices?.min_price && filters?.prices?.max_price && filters?.prices?.min_price !== filters?.prices?.max_price" class="border-b"></div>

        <ShopFilterLabels
                v-if="filters?.sizes?.length"
                v-model="model.sizes"
                :filter_data="filters?.sizes"
                title="Размеры" />

        <div v-if="filters?.sizes?.length" class="border-b"></div>

        <ShopFilterColor
                v-if="filters?.colors?.length"
                v-model="model.colors"
                :filter_data="filters?.colors"
                title="Цвет" />

        <div v-if="filters?.colors?.length" class="border-b"></div>
        
		<Button
			@click.prevent="$emit('apply')"
			class="w-full rounded"
            size="lg">
			Применить фильтр
		</Button>
	</div>
	</transition>
</template>

<script setup>
import ShopFilterPrice from './ShopFilterPrice.vue'
import ShopFilterLabels from './ShopFilterLabels'
import ShopFilterSection from './ShopFilterSection'
//import ShopActiveFilters from './ShopActiveFilters'
import {useWindowSize} from "@vueuse/core";
import ShopFilterColor from "~/components/UI/ShopFilter/ShopFilterColor.vue";
import {Button} from "~/components/shadcn/ui/button";

const {width} = useWindowSize()
const props = defineProps({
    filters: {
        type: Object,
        default: () => ({})
    }
})

const model = defineModel()

const emit = defineEmits(['apply'])
const isFormOpened = ref(false)
const isMobile = computed(() => width.value <= 768)
</script>
