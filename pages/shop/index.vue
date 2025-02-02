<template>
    <div class="container mt-12">
        <div class="grid grid-cols-4 gap-7">
            <div class="col-span-4 lg:col-span-1">
                <ShopFilter
                    v-model="filter"
                    :filters="availableFilters"
                    @apply="refreshProductsList"
                />
            </div>
            <div class="col-span-4 lg:col-span-3">
                <div class="shop_grid_top_filters flex flex-wrap md:flex-nowrap gap-4 items-center justify-between mb-4">
                    <div class="col-auto">
                        <p class="mb-0 text-sub text-sm">{{ countProducts }}</p>
                    </div>
                    <div class="col-md-7">
                        <div class="flex flex-wrap md:flex-nowrap gap-4">
                            <div class="w-full md:w-fit">
                                <div class="flex w-full max-w-sm items-center gap-1">
                                    <Input v-model="filter.search" placeholder="Поиск по товарам" class="my-0" />
                                    <Button :disabled="!filter.search" @click.prevent="refreshProductsList" variant="secondary" size="icon" class="px-2 w-auto">
                                        <Icon name="ri:search-2-line" size="18px" />
                                    </Button>
                                </div>
<!--                                <div class="input-group">
                                    <input
                                            v-model="filter.search"
                                            class="form-control"
                                            placeholder="Поиск по товарам"
                                            type="text"
                                    />
                                    <div class="input-group-append position-absolute top-50 end-0 translate-middle">
                                        <button
                                                v-if="filter.search"
                                                class="btn btn-link text-dark p-0"
                                                type="button"
                                                @click.prevent="applyFilter()"
                                        >
                                            <vue-feather type="search"/>
                                        </button>
                                    </div>
                                </div>-->
                            </div>
                            <div class="w-full md:w-fit">
                                <Select v-model="computedSort">
                                    <SelectTrigger>
                                        <Icon name="ri:arrow-up-down-fill" class="mr-2 text-sub" />
                                        <SelectValue placeholder="Сортировать по" />
                                    </SelectTrigger>
                                    <SelectContent>
                                            <SelectItem value="order">По умолчанию</SelectItem>
                                            <SelectItem value="name">По названию</SelectItem>
                                            <SelectItem value="price_DESC">По убыванию цены</SelectItem>
                                            <SelectItem value="price_ASC">По возрастанию цены</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
                <template v-if="statusProductsList === 'success' && productsList && productsList.length">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                        <ShopProductCard v-for="item in productsList" :item="item" />
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import ShopFilter from '~/components/UI/ShopFilter/ShopFilter.vue'
import ShopProductGrid from '~/components/shop/ShopProductGrid.vue'
import { pluralize } from '@/helpers/pluralize'
import ShopProductCard from "~/components/shop/ShopProductCard.vue";
import {Button} from "~/components/shadcn/ui/button";
import {Input} from "~/components/shadcn/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn/ui/select'

const filter = ref({
    sort_by: 'order',
    sort_order: 'desc',
    shop_category_id: null,
    shop_collection_id: null,
    min_price: 0,
    max_price: 0,
    search: null,
    sizes: [],
    colors: [],
    per_page: 15,
    page: 1,
})

const totalItems = ref(0)

const {data: availableFilters} = useAsyncData('shop_available_filters', () => getAvailableFilters())
const {data: productsList, refresh: refreshProductsList, status: statusProductsList} = useAsyncData('shop_products', () => getProductsList(), {
    watch: false // Отключаем автоматическое отслеживание
})

async function getProductsList(){
    const query = new URLSearchParams();

    Object.entries(filter.value).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach(v => query.append(key + '[]', v));
        } else if (value !== null && value !== '') {
            query.append(key, value);
        }
    });

    return await fetchData('/shop/products?' + query.toString(), {
        method: 'GET'
    }).then((response) => {
        totalItems.value = response.total;
        return response.items;
    }).catch((e) => {
        console.error(e);
    });
    /*return await fetchData('/shop/products', {
        method: 'GET',
        query: filter.value,
    }).then((response) => {
        totalItems.value = response.total
        return response.items
    }).catch((e) => {
        console.error(e)
    })*/
}

async function getAvailableFilters(){
    return await fetchData('/shop/available-filters', {
        method: 'GET',
    }).then((response) => {
        return response
    }).catch((e) => {
        console.error(e)
    })
}

const countProducts = computed(() => {
    return pluralize(totalItems.value, ['товар', 'товара', 'товаров'])
})

const computedSort = computed({
    get: () => {
        switch (filter.value.sort_by) {
            case 'min_price':
                return filter.value.sort_order === 'desc' ? 'price_DESC' : 'price_ASC'
            case 'name':
                return 'name'
            default:
                return 'order'
        }
    },
    set: (value) => {
        if (value === 'price_DESC') {
            filter.value.sort_by = 'min_price'
            filter.value.sort_order = 'desc'
        } else if (value === 'price_ASC') {
            filter.value.sort_by = 'min_price'
            filter.value.sort_order = 'asc'
        } else {
            filter.value.sort_by = value
            filter.value.sort_order = value === 'name' ? 'asc' : 'desc'
        }
    }
})

watch(() => filter.value.sort_by, () => {
    refreshProductsList()
})

const applyFilter = async () => {
    /*await productGridRef.value.fetchProducts()
    show_button.value = false*/
    //router.push({query: activeQuery.value})
}
</script>

<style></style>