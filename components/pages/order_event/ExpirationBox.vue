<script setup lang="ts">

import {Button} from "~/components/shadcn/ui/button";
import OrderStatusBadge from "~/components/UI/OrderStatusBadge.vue";
import TimeCounter from "~/components/UI/TimeCounter.vue";
import {parse, parseISO} from "date-fns";

const props = defineProps({
    orderData: {
        type: Object,
        required: true
    },
    submitMode: {
        type: String,
    },
})

const emit = defineEmits(['timeEnd'])

const globalStore = useGlobalStore()

const localExpired = ref(false)

const amountToPay = computed(() => {
    if(props.orderData.already_paid){
        return props.orderData.summ - props.orderData.already_paid
    }
    return props.orderData.summ
})

const hasExpiration = computed(() => {
    return props.orderData.expiration_at &&
        parseISO(props.orderData.expiration_at) >
        parse(globalStore.server_time, 'yyyy-MM-dd HH:mm:ss', new Date())
})

function timeEnd(){
    localExpired.value = true
    emit('timeEnd')
}

</script>

<template>
    <div class="payment_side_box bg-secondary rounded p-4 text-white grid gap-4">
        <div class="">
            <p class="mb-1 text-sm">Статус заявки</p>
            <OrderStatusBadge :status="orderData.status" />
        </div>
        <div v-if="submitMode === 'pay' && amountToPay" class="flex justify-between">
            <div class="font-bold">
                <p class="text-sm">К оплате</p>
                <p class="text-xl font-bold">{{amountToPay}} ₽</p>
            </div>
            <a href="#order_list" class="text-sm text-white underline">Подробнее</a>
        </div>
        <div v-if="hasExpiration && !localExpired" class="border border-accent p-4 rounded-lg">
            <p class="text-accent font-oswald uppercase text-xl font-bold mb-2">Внимание!</p>
            <p class="text-accent font-bold mb-2">Резерв неоплаченных дистанций будет отменен через</p>
            <TimeCounter :end-date="orderData.expiration_at" @time-end="timeEnd" class="font-bold text-accent text-xl" />
        </div>
        <Button
                v-if="submitMode"
                variant="primary"
                type="submit"
                form="payment_form"
                class="rounded-full w-full"
                size="lg"
        >
            {{submitMode === 'pay' ? 'Перейти к оплате' : 'Отправить'}}
        </Button>
    </div>
</template>

<style scoped>

</style>