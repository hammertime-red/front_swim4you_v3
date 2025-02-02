<template>
	<div v-if="items && items.length" class="row g-4">
		<div v-for="(item, i) in items" :key="i" class="col-md-6" :class="itemClass">
			<ShopProductCard :item="item" />
		</div>
	</div>
    <div v-if="emptynote && loaded && total == 0" class="bg-white p-4 text-center">
        <h3 class="font-bold font-oswald">Не найдено результатов по вашему запросу</h3>
        <p class="text-sub mb-0">Попробуйте изменить условия поиска</p>
    </div>
</template>

<script>
import ShopProductCard from './ShopProductCard'
import axios from "axios"
export default {
	props: {
		itemClass: {
			type: String,
			default: 'col-lg-3',
		},
		filter: {
			type: Object,
			default: null,
		},
        maxItems: {
            type: Number,
            default: -1
        },
        autofetch: {
            type: Boolean,
            default: true
        },
        emptynote: {
            type: Boolean,
            default: false
        },
	},
    data(){
        return {
            items: [],
            total: 0,
            loaded: false
        }
    },
    created(){
        if(this.autofetch){
            this.fetchProducts()
        }
    },
    methods: {
        async fetchProducts(){
            try{
                const response = await axios.get(process.env.VUE_APP_BASE_URL+'shop', {params: this.filter})
                //dd(response.data);
                if(response.data){
                    this.items = response.data.data
                    this.total = response.data.total
                    
                    this.$emit('page', response.data.current_page)
                    this.$emit('count', response.data.total)
                    this.loaded = true
                }
            } catch (e){
                console.log(e.response);
                alert("Ошибка получения данных с сервера о товарах")
            }
        },
    },
	components: { ShopProductCard },
    emits: ['page', 'count']
}
</script>

<style></style>
