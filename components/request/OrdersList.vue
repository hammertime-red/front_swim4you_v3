<template>
    <div class="content_box p-4 mb-4">
        <div class="content_box__header flex justify-between items-center mb-3 relative z-2">
            <h2 class="title_block text-sub">Состав заявки</h2>
        </div>
        <div class="orders grid gap-3">
            <template v-if="distancesOrderList.length">
                <div
                        v-for="(type, i) in distancesOrderList"
                        :key="`distance-${type.distance}-${i}`"
                        class="bg-slate-100 px-3 py-3 rounded-lg flex justify-between items-center"
                >
                    <p class="product_name font-bold mb-0">
                        Заявочный взнос за дистанцию {{type.distance}}м
                        {{type.count === 'many' ? 'со скидкой' : ''}}
                    </p>
                    <p class="price text-positive font-bold mb-0">
                        {{type.quantity}} x {{type.price}} ₽
                    </p>
                </div>
            </template>

            <div v-if="relaysOrderList.quantity" class="bg-slate-100 px-3 py-3 rounded-lg flex justify-between items-center">
                <p class="product_name font-bold mb-0">Заявочный взнос за эстафеты</p>
                <p class="price text-positive font-bold mb-0">
                    {{relaysOrderList.quantity}} x {{relaysOrderList.price}} ₽
                </p>
            </div>

            <OrderListServiceItem
                    v-for="(items, i) in extraItemsOrderList"
                    :key="`service-${i}`"
                    :items="items"
                    :post-data="postData"
            />
        </div>

        <div v-if="orderData.summ" class="orders__summ flex justify-between text_20 font-bold mt-4">
            <span>Итого: </span>
            <span class="text-positive">{{orderData.summ}} ₽</span>
        </div>
        <div v-if="orderData.already_paid" class="orders__summ flex justify-between text_20 font-bold mt-2">
            <span>Оплачено: </span>
            <span>{{orderData.already_paid}} ₽</span>
        </div>
        <div v-if="extraPay" class="orders__summ flex justify-between text_20 font-bold mt-2">
            <span>К оплате: </span>
            <span class="text-positive">{{extraPay}} ₽</span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import OrderListServiceItem from './OrderListServiceItem'

const props = defineProps({
    postData: {
        type: Object,
        required: true
    },
    orderData: {
        type: Object,
        required: true
    },
    alreadyPaid: {
        type: Number,
        default: 0
    },
    summ: {
        type: Number,
        default: 0
    },
    relayPrice: {
        type: Number,
        default: null
    }
})

const distancesOrderList = computed(() => {
    const distances = props.orderData.order_items.filter(item => item.distance_type === 'distance')
    
    return useChain(distances)
        .groupBy(item => `${item.distance_length}-${item.price_type}`)
        .map(value => ({
            distance: value[0].distance_length,
            count: value[0].price_type,
            quantity: value.length,
            price: value[0].price
        }))
        .value()
})

const relaysOrderList = computed(() => {
    const relays = props.orderData.order_items.filter(item => item.distance_type === 'relay')
    const count = useReduce(relays, (acc, el) =>
        acc + (el.quantity > 0 ? el.quantity : 0), 0)

    return {
        quantity: count,
        price: props.postData?.relay_price ?? 0
    }
})

const extraItemsOrderList = computed(() =>
    useChain(props.orderData.extra_items)
        .groupBy('extra_service_id')
        .value()
)

const extraPay = computed(() =>
    props.orderData.already_paid ? props.orderData.summ - props.orderData.already_paid : null
)
</script>