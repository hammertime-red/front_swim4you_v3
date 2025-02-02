<template>
<div v-if="uploaded" class="payment_side_box sticky_box bg-secondary rounded p-4 text-white mb-4">
    <p class="mb-2">Статус заявки</p>
    <OrderStatusBadge :status="payment_status" />
    <div v-if="first_status == 'pending_payment' && payment_status == 'pending_payment'" class="flex justify-between mb-4 mt-4">
        <div class="font-bold">
            <p class="mb-0">К оплате</p>
            <p class="text_20 font-bold">{{summ}} ₽</p>
        </div>
        <a href="#order_list" class="text-white">Подробнее</a>
    </div>
    <div v-if="this.paytime_end && payment_status == 'pending_payment' && summ > 0" class="mb-4 text-accent">
        <p>Пожалуйста, оплатите заказ в течение</p>
        <VueCountdown :time="end_timer" :transform="transformSlotProps" v-slot="{ days, hours, minutes, seconds }" @end="onCountdownEnd">
            <p class="counter font-bold">
                <span v-if="days != '00'">{{days}} дн. </span>  
                <span v-if="hours != '00'">{{hours}} час. </span>  
                <span>{{minutes}} мин. </span>  
                <span>{{seconds}} сек.</span>
            </p>
        </VueCountdown>
        <p>В противном случае заявка будет аннулирована</p>
    </div>
    <button v-if="first_status == 'pending_payment' && payment_status == 'pending_payment'" @click.prevent="$emit('send')" class="btn btn-primary btn-primary-shadow btn-rounded w-full">Перейти к
        оплате</button>
</div>
</template>

<script>
import OrderStatusBadge from './UI/OrderStatusBadge'
import moment from "moment";
import VueCountdown from '@chenfengyuan/vue-countdown';
export default {
    props: ['id', 'payment_status', 'summ', 'paytime_end', 'first_status'],
    data() {
        return {
            end_timer: null,
            uploaded: false
        }
    },
    async mounted(){
        await this.setTimer()
        this.uploaded = true
    },
    methods: {
        transformSlotProps(props) {
            const formattedProps = {};

            Object.entries(props).forEach(([key, value]) => {
                formattedProps[key] = value < 10 ? `0${value}` : String(value);
            });

            return formattedProps;
        },
        onCountdownEnd() {
            this.$emit('time_end')
        },
        async setTimer(){
            console.log(this.paytime_end);
            if(this.paytime_end && this.payment_status == 'pending_payment'){
                let current_date = moment()
                this.end_timer = moment(this.paytime_end) - current_date
                if(this.end_timer < 0) this.onCountdownEnd()
            }
        }
    },
    emits: ['time_end', 'send'],
    components: {
    OrderStatusBadge,VueCountdown},
}
</script>

<style>

</style>
