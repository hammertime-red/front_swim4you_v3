<script setup>
import OrderEvent from "~/components/pages/order_event/OrderEvent.vue";

const emit = defineEmits(['nextStep', 'prevStep', 'timeEnd'])

const postData = inject("postData");
const orderData = inject("orderData");

</script>

<template>
    <div class="">
        <OrderEvent  :post-data="postData" :order-data="orderData" @time-end="emit('timeEnd')" @prev-step="emit('prevStep')" is-form  />
    </div>
</template>

<style scoped>

</style>