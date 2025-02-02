<template>
    <PageLoader v-if="!loaded" />
    <photobank-layout>
        <template #content>
            <div class="container">
                <OrderResultMessage
                    class="pt-5"
                    v-if="show_order_message || orderdata.payment_status === 'paid'"
                    :status="orderdata.payment_status"
                    @downloadPhotos="downloadPhotos()"
                    @goToPayment="goToPayment()" />
                <div class="row g-4 mt-0 pt-3">
                    <div class="col-lg-5">
                        <div class="content_box p-4">
                            <h2 class="title_block mb-4">Состав заказа</h2>
                            <div class="cart_items mb-4">
                                <PhtCartItem v-for="(item, i) in orderItems" :item="item" :key="i" :deleteBtn="false" :index="i" />
                            </div>
                            <div
                                class="cart_summ flex items-center justify-between font-bold fs-6">
                                <p class="mb-0">Итого:</p>
                                <p class="mb-0">{{orderdata.summ}} ₽</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-7">
                        <RequestOrderInfo
                            :id="orderdata.id"
                            :payment_status="orderdata.payment_status"
                            :summ="orderdata.summ"
                            :paytime_end="orderdata.paytime_end"
                            @send="goToPayment()"
                            @time_end="time_end()" />
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div
                                    v-if="
										orderdata.payers_name ||
										orderdata.payers_phone ||
										orderdata.payers_email
									"
                                    class="content_box p-4">
                                    <div
                                        class="content_box__header flex justify-between items-center mb-3 relative z-2">
                                        <h2 class="title_block mb-2 text-sub">Плательщик</h2>
                                    </div>
                                    <table class="list_box__content">
                                        <tr v-if="orderdata.payers_name">
                                            <td class="text-sub">ФИО:</td>
                                            <td class="ps-3">{{ orderdata.payers_name }}</td>
                                        </tr>
                                        <tr v-if="orderdata.payers_phone">
                                            <td class="text-sub">Телефон:</td>
                                            <td class="ps-3">{{ orderdata.payers_phone }}</td>
                                        </tr>
                                        <tr v-if="orderdata.payers_email">
                                            <td class="text-sub">Email:</td>
                                            <td class="ps-3">{{ orderdata.payers_email }}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div v-if="orderdata.payment_method" class="content_box p-4 h-full">
                                    <div
                                        class="content_box__header flex justify-between items-center mb-3 relative z-2">
                                        <h2 class="title_block mb-2 text-sub">Способ оплаты</h2>
                                    </div>
                                    <p class="font-bold mb-1">Название способа оплаты</p>
                                    <p class="text-sub text-sm mb-0">Описание способа оплаты</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #offcanvas></template>
    </photobank-layout>
</template>

<script>
import PageLoader from '~/components/PageLoader.vue'
import RequestOrderInfo from '~/components/RequestOrderInfo.vue'
import OrderResultMessage from '~/components/photobank/OrderResultMessage'
import PhtCartItem from '~/components/cards/PhtCartItem.vue'
import PhotobankLayout from '../../layouts/PhotobankLayout.vue'
import { mapActions } from 'vuex'
export default {
    props: {
        orderdata: {
            type: Object,
            default: {}
        },
    },
    data(){
        return {
            loaded: false,
            show_order_message: false
        }
    },
    computed: {
        PHOTOS(){
            return this.$store.getters['photobank/getCartItems']
        },
        itemsIds(){
            return this.orderdata.items.map(el => parseInt(el.id))
        },
        orderItems(){
            return this.PHOTOS.filter(el => this.itemsIds.includes(el.id))
        }
    },
    async mounted() {
        await this.fetchCartPhotos(this.itemsIds)
        await this.checkPaymentStatus()
        this.loaded = true
    },
    methods: {
        ...mapActions({
            fetchCartPhotos: 'photobank/fetchCartPhotos',
            fetchPaymentStatus: 'order/fetchPaymentStatus',
            getPaymentUrl: 'order/getPaymentUrl',
        }),
        downloadPhotos() {
            this.$router.push({name: 'profile', query: {tab: 'Мои фото', order_id: this.orderdata.id}})
        },
        async goToPayment() {
            this.$swal({
                title: 'Перенаправление на форму оплаты',
                text: 'Пожалуйста, не закрывайте страницу',
                icon: 'info',
                allowOutsideClick: false,
                allowEnterKey: false,
                allowEnterKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    this.$swal.showLoading()
                },
            })
            let res = await this.getPaymentUrl(this.$route.params.id)
            if (res?.url) {
                window.location.href = res.url
            } else {
                this.$swal.close()
                this.$swal('Возникла неизвестная ошибка, попробуйте еще раз', '', 'error')
            }
        },
        time_end() {
            this.orderdata.status = 'rejected'
            this.orderdata.payment_status = 'rejected'
        },
        async checkPaymentStatus() {
            if (
                this.orderdata.payment_status == 'pending'
            ) {
                let res = await this.fetchPaymentStatus(this.orderdata.id)
                this.show_order_message = true
            }
        },
    },
    components: {
        OrderResultMessage,
        PhotobankLayout,
        PhtCartItem,
        OrderResultMessage,
        RequestOrderInfo,
        PageLoader
    },
}
</script>

<style></style>
