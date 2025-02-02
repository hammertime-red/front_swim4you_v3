<template>
    <div class="content_box p-4">
        <div class="content_box__header flex justify-between items-center mb-3 relative z-2">
            <h2 class="title_block mb-2 text-sub">Информация о заказе</h2>
        </div>
        <div class="order_info flex flex-wrap gap-7 mb-3">
            <div class="col-auto text-sm">
                <p class="text-sub mb-1">ID заказа:</p>
                <p class="mb-0">#{{orderData.id}}</p>
            </div>
            <div class="col-auto text-sm">
                <p class="text-sub mb-1">Сумма:</p>
                <p class="mb-0">{{orderData.summ}} ₽</p>
            </div>
            <div v-if="orderData.already_paid" class="col-auto text-sm">
                <p class="text-sub mb-1">Оплачено:</p>
                <p class="mb-0">{{ orderData.already_paid }} ₽</p>
            </div>
            
            <div v-if="orderData.status" class="col-auto text-sm">
                <p class="text-sub mb-1">Статус заказа:</p>
                <ShopOrderStatusBadge :status="orderData.status" />
            </div>
            
            <div v-if="orderData?.paytime_end && orderData.status == 'pending_payment' && orderData.summ > 0" class="mb-4 text-accent">
                <p>Пожалуйста, оплатите заказ в течение</p>
                <TimeCounter :end-date="orderData.expiration_at" @time-end="emit('timeEnd')" class="font-bold text-accent text-xl" />
                <p>В противном случае заказ будет отменён</p>
            </div>
            <div v-if="orderData.status === 'pending_payment' && amountToPay > 0" class="w-full">
                <p class="text-sub mb-1 text-sm">К оплате: </p>
                <p class="text_20 font-bold mb-0">{{amountToPay}} ₽</p>
            </div>
        </div>
        <Button
                variant="primary"
                size="lg"
                v-if="orderData.status === 'pending_payment'"
                @click.prevent="emit('goToPayment')"
                class="rounded-full"
        >
            Перейти к оплате
        </Button>
    </div>
</template>

<script setup>
import ShopOrderStatusBadge from "~/components/UI/ShopOrderStatusBadge.vue";
import {Button} from "~/components/shadcn/ui/button";
import TimeCounter from "~/components/UI/TimeCounter.vue";

const props = defineProps({
    orderData: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['timeEnd', 'goToPayment'])

const amountToPay = computed(() => {
    if(props.orderData.already_paid){
        return props.orderData.summ - props.orderData.already_paid
    }
    return props.orderData.summ
})
</script>