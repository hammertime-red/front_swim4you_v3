<template>
  <div class="shop_filter__section shop_filter__section--active_filters">
        <p class="font-oswald uppercase font-bold">Активные фильтры</p>

        <div v-if="query?.search" class="active_filter_item bg-white p-3 mb-1 flex justify-between items-center">
            <div class="content">
                <span class="label text-sm me-2">Поиск по:</span>
                <span class="small value font-bold">{{query.search}}</span></div>
            <button @click.prevent="$emit('removeFilter', 'search')" class="btn btn-link px-2 py-0 text-sub"><vue-feather type="x" /></button>
        </div>

        <div v-if="query?.shop_category" class="active_filter_item bg-white p-3 mb-1 flex justify-between items-center">
            <div class="content">
                <span class="label text-sm me-2">Категория:</span>
                <span class="small value font-bold">{{query.shop_category}}</span></div>
            <button @click.prevent="$emit('removeFilter', 'shop_category')" class="btn btn-link px-2 py-0 text-sub"><vue-feather type="x" /></button>
        </div>

        <div v-if="query?.shop_collection" class="active_filter_item bg-white p-3 mb-1 flex justify-between items-center">
            <div class="content">
                <span class="label text-sm me-2">Событие:</span>
                <span class="small value font-bold">{{query.shop_collection}}</span></div>
            <button @click.prevent="$emit('removeFilter', 'shop_category')" class="btn btn-link px-2 py-0 text-sub"><vue-feather type="x" /></button>
        </div>

        <div v-if="query?.price_min && query?.price_max" class="active_filter_item bg-white p-3 mb-1 flex justify-between items-center">
            <div class="content">
                <span class="label text-sm me-2">Цена:</span>
                <span class="small value font-bold">{{query.price_min}}₽ - {{query.price_max}}₽</span></div>
            <button @click.prevent="$emit('removeFilter', 'price')" class="btn btn-link px-2 py-0 text-sub"><vue-feather type="x" /></button>
        </div>

        <div v-if="query?.size && query?.size.length" class="active_filter_item bg-white p-3 mb-1 flex justify-between items-center">
            <div class="content"><span class="label text-sm me-2">Размер:</span><span class="small value font-bold">{{querySize}}</span></div>
            <button @click.prevent="$emit('removeFilter', 'size')" class="btn btn-link px-2 py-0 text-sub"><vue-feather type="x" /></button>
        </div>

        <div v-if="query?.color && query?.color.length" class="active_filter_item bg-white p-3 mb-1 flex justify-between items-center">
            <div class="content"><span class="label text-sm me-2">Цвет:</span><span class="small value font-bold">{{queryColor}}</span></div>
            <button @click.prevent="$emit('removeFilter', 'color')" class="btn btn-link px-2 py-0 text-sub"><vue-feather type="x" /></button>
        </div>

    </div>
</template>

<script>
export default {
    computed: {
        query(){
            return this.$route.query
        },
        querySize(){
            if(!this.query?.size && !this.query?.size.length) return null
            if(typeof this.query.size === 'string') return this.query.size
            return this.query.size.join(', ')
        },
        queryColor(){
            if(!this.query?.color && !this.query?.color.length) return null
            if(typeof this.query.color === 'string') return this.query.color
            return this.query.color.join(', ')
        },
    },
    emits: ['removeFilter']
}
</script>

<style>
</style>