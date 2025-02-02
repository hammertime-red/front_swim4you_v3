<template>
<div class="content_box p-4 mb-4">
    <div class="content_box__header flex justify-between items-center mb-3 relative z-2">
        <h2 class="title_block mb-2 text-sub">Состав заказа</h2>
    </div>
    <div class="orders">
        <div v-if="athletes_count && entry_fee" class="orders__item">
            <p class="product_name font-bold mb-0">{{title}}</p>
            <p class="price text-positive font-bold mb-0">{{athletes_count}} x {{entry_fee}} ₽</p>
        </div>

    </div>
    <div v-if="calculateSumm" class="orders__summ flex justify-between text_20 font-bold mt-4">
        <span>Итого: </span>
        <span class="text-positive">{{calculateSumm}} ₽</span>
    </div>
</div>
</template>

<script>
import OrderListServiceItem from './OrderListServiceItem'
export default {
  components: { OrderListServiceItem },
    props: ['athletes_count', 'postdata', 'title', 'entry_fee'],
    computed: {
        calculateSumm(){
            let summ = 0
            summ += this.athletes_count * this.entry_fee
            return summ
        }
    }
}
</script>

<style>

</style>
