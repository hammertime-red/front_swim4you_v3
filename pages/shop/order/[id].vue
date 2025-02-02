<template>
    <PageLoader v-if="loadedStatus !== 'success'"/>
    <div v-if="orderData" class="container my-12">
        <div v-if="orderData.status === 'pending_payment'" class="p-8 rounded-xl bg-accent mb-8">
            <Icon class="text-amber-700" name="line-md:alert-circle-loop" size="60px"/>
            <div class="">
                <p class="font-oswald text-4xl mb-4 font-bold">Заказ ожидает оплаты</p>
                <p class="mb-0">
                    Пожалуйста, проверьте правильность ввода данных карточки, наличие необходимой суммы на счету и
                    попробуйте еще раз.<br>
                    <b>Если вы уверены, что оплата прошла успешно, просто перезагрузите страницу через пять минут,
                        возможно мы еще не получили информацию о платеже.</b>
                </p>
            </div>
        </div>
        <div v-else-if="orderData.status === 'sent'" class="p-8 rounded-xl content_box mb-8">
            <Icon class="text-positive" name="line-md:confirm-circle" size="60px"/>
            <div class="">
                <p class="font-oswald text-4xl mb-4 font-bold text-positive">Заказ успешно оплачен</p>
                <p class="mb-0">
                    Спасибо, ваш заказ получен. Информация о заказе направлена на указанный email
                </p>
            </div>
        </div>

        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 lg:col-span-5">
                <div class="content_box p-4 flex flex-col rounded-0 h-full">
                    <h2 class="title_block mb-4">Состав заказа</h2>
                    <div class="cart_items mb-4">
                        <ShopCartItem
                                v-for="(item, i) in orderData.order_items"
                                :key="i"
                                :deleteBtn="false"
                                :item="item"
                                :qtyField="false"
                        />
                    </div>
                    <div
                            class="cart_summ flex items-center justify-between font-bold fs-6 mt-auto">
                        <p class="mb-0 fs-4">Итого:</p>
                        <p class="mb-0 fs-4 text-positive">{{ orderData.summ }} ₽</p>
                    </div>
                </div>
            </div>
            <div class="col-span-12 lg:col-span-7">
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <div class="content_box p-4">
                            <div class="content_box__header flex justify-between items-center mb-3 relative z-2">
                                <h2 class="title_block mb-2 text-sub">Информация о заказе</h2>
                            </div>
                            <div class="order_info flex flex-wrap gap-7 mb-3">
                                <div class="col-auto text-sm">
                                    <p class="text-sub mb-1">ID заказа:</p>
                                    <p class="mb-0">#{{ orderData.id }}</p>
                                </div>
                                <div class="col-auto text-sm">
                                    <p class="text-sub mb-1">Сумма:</p>
                                    <p class="mb-0">{{ orderData.summ }} ₽</p>
                                </div>
                                <div v-if="orderData.already_paid" class="col-auto text-sm">
                                    <p class="text-sub mb-1">Оплачено:</p>
                                    <p class="mb-0">{{ orderData.already_paid }} ₽</p>
                                </div>

                                <div v-if="orderData.status" class="col-auto text-sm">
                                    <p class="text-sub mb-1">Статус заказа:</p>
                                    <ShopOrderStatusBadge :status="orderData.status"/>
                                </div>

                                <div v-if="orderData?.paytime_end && orderData.status == 'pending_payment' && orderData.summ > 0"
                                     class="mb-4 text-accent">
                                    <p>Пожалуйста, оплатите заказ в течение</p>
                                    <TimeCounter :end-date="orderData.expiration_at" class="font-bold text-accent text-xl"
                                                 @time-end="orderRefresh"/>
                                    <p>В противном случае заказ будет отменён</p>
                                </div>

                            </div>

                        </div>
                    </div>
                    <div v-if="orderData.status === 'pending_payment' && orderData?.allowed_payment_methods.length"
                         class="col-span-2">
                        <div class="content_box p-4 h-full">
                            <div class="content_box__header flex justify-between items-center mb-3 relative z-2">
                                <h2 class="title_block mb-2 text-sub">Оплатить заказ</h2>
                            </div>
                            <div v-if="orderData.status === 'pending_payment' && orderData.amount_to_pay > 0"
                                 class="w-full">
                                <p class="text-sub mb-1 text-sm">К оплате: </p>
                                <p class="text_20 font-bold mb-0">{{ amount_to_pay }} ₽</p>
                            </div>
                            <Form @submit="onSubmit" v-slot="{errors}">
                                <PaymentMethodField
                                        :initial-value="orderData?.payment_method?.id || null"
                                        :options="orderData?.allowed_payment_methods"
                                        name="payment_method_id"
                                        option-description="display_description"
                                        option-label="display_name"
                                        option-value="id"
                                />
                                <GlobalErrorAlert v-if="errors.global" :error="errors.global" class="form_error_message mt-4" />
                                <Button
                                        v-if="orderData.status === 'pending_payment'"
                                        class="rounded-full mt-4"
                                        size="lg"
                                        type="submit"
                                        variant="primary"
                                >
                                    Перейти к оплате
                                </Button>
                            </Form>
                        </div>
                    </div>
                    <div v-if="orderData?.event" class="col-span-2 md:col-span-1">
                        <div
                                class="content_box p-4">
                            <div
                                    class="content_box__header flex justify-between items-center mb-3 relative z-2">
                                <h2 class="title_block mb-2 text-sub">Где забрать заказ</h2>
                            </div>
                            <div class="content_box_content">
                                <div v-if="orderData.event?.name" class="small mb-3">
                                    <p class="text-sub mb-1">Мероприятие:</p>
                                    <p class="mb-0">{{ orderData.event.name }}</p>
                                </div>
                                <div v-if="orderData.event?.address" class="small mb-3">
                                    <p class="text-sub mb-1">Адрес:</p>
                                    <p class="mb-0">{{ orderData.event.address }}</p>
                                </div>
                                <div v-if="eventDates" class="small mb-3">
                                    <p class="text-sub mb-1">Даты:</p>
                                    <p class="mb-0">{{ eventDates }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-2 md:col-span-1">
                        <div
                                v-if="
                                    orderData.payers_name ||
                                    orderData.payers_phone ||
                                    orderData.payers_email
                                "
                                class="content_box p-4 h-full">
                            <div
                                    class="content_box__header flex justify-between items-center mb-3 relative z-2">
                                <h2 class="title_block mb-2 text-sub">Плательщик</h2>
                            </div>
                            <table class="list_box__content">
                                <tr v-if="orderData.payers_name">
                                    <td class="text-sub">ФИО:</td>
                                    <td class="!pl-3">{{ orderData.payers_name }}</td>
                                </tr>
                                <tr v-if="orderData.payers_phone">
                                    <td class="text-sub">Телефон:</td>
                                    <td class="!pl-3">{{ orderData.payers_phone }}</td>
                                </tr>
                                <tr v-if="orderData.payers_email">
                                    <td class="text-sub">Email:</td>
                                    <td class="!pl-3">{{ orderData.payers_email }}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div v-if="orderData.status != 'pending_payment' && orderData.payment_method"
                         class="col-span-2 md:col-span-1">
                        <div class="content_box p-4 h-full">
                            <div
                                    class="content_box__header flex justify-between items-center mb-3 relative z-2">
                                <h2 class="title_block mb-2 text-sub">Способ оплаты</h2>
                            </div>
                            <p v-if="orderData.payment_method.display_name" class="font-bold mb-1">
                                {{ orderData.payment_method.display_name }}</p>
                            <p v-if="orderData.payment_method.display_description" class="text-sub text-sm mb-0">
                                {{ orderData.payment_method.display_description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
//import ShopOrderResultMessage from './ShopOrderResultMessage.vue'
import PageLoader from '~/components/PageLoader.vue'
import ShopCartItem from '~/components/UI/ShopCartItem.vue'
import {computed} from "vue";
import {datesRange} from "~/services/dates.js";
import PaymentMethodField from "~/components/UI/Fields/PaymentMethodField.vue";
import {Form} from "vee-validate";
import ShopOrderStatusBadge from "~/components/UI/ShopOrderStatusBadge.vue";
import TimeCounter from "~/components/UI/TimeCounter.vue";
import {Button} from "~/components/shadcn/ui/button";
import GlobalErrorAlert from "~/components/forms/GlobalErrorAlert.vue";

definePageMeta({
    name: 'shop_order'
})

const userStore = useUserStore()
const route = useRoute()
const { $swal } = useNuxtApp()
const {
    data: orderData,
    status: loadedStatus,
    refresh: orderRefresh
} = useAsyncData(`shop_order_${route.params.id}`, async () => {
    
    if(!userStore.userdata){
        await userStore.restoreState()
    }
    
    if (userStore.isAuthenticated) {
        return await fetchAuth(`/shop/order/${route.params.id}`, {
            method: 'GET',
        })
            .then(res => res)
            .catch(err => console.error(err))
    } else {
        return await fetchData(`/shop/order/${route.params.id}/guest`, {
            method: 'GET',
        })
            .then(res => res)
            .catch(err => console.error(err))
    }
})

async function onSubmit(values, context) {
    console.log('onSubmit')
    const loading  = await $swal.loading(
        'Перенаправление на форму оплаты',
        'Пожалуйста, не закрывайте страницу')

    if(userStore.isAuthenticated) {
        await fetchAuth(`/shop/order/${route.params.id}/toPayment`, {
            method: 'POST',
            body: values,
        }).then(async (response) => {
            if(response?.payment_url){
                navigateTo(response.payment_url, {
                    external: true
                })
            }
        }).catch((error) => {
            console.log(error.data)
            context.setErrors({global: error.data?.message})
        })
    } else {
        await fetchData(`/shop/order/${route.params.id}/toPayment/guest`, {
            method: 'POST',
            body: values,
        }).then(async (response) => {
            if(response?.payment_url){
                navigateTo(response.payment_url, {
                    external: true
                })
            }
        }).catch((error) => {
            console.log(error.data)
            context.setErrors({global: error.data?.message, ...error.data.errors})
        })
    }
    loading.close()
}

const eventDates = computed(() => {
    if (!orderData.value?.event?.start_event_date) return null
    return datesRange(orderData.value?.event?.start_event_date, orderData.value?.event?.end_event_date)
})
/*
export default {
    /!* props: {
        orderdata: {
            type: Object,
            default: {}
        },
    }, *!/
    data(){
        return {
            loaded: false,
            show_order_message: false,
            orderdata: {},
        }
    },
    computed: {

    },
    async mounted() {
        await this.fetchOrderData()
        await this.checkPaymentStatus()
        this.loaded = true
    },
    methods: {
        ...mapActions({
            fetchPaymentStatus: 'shop/fetchPaymentStatus',
            getPaymentUrl: 'shop/getPaymentUrl',
        }),
        async fetchOrderData(){
            try{
                const response = await api.get(process.env.VUE_APP_BASE_URL+'shop/order/'+this.$route.params.post)
                if(response.data){
                    this.orderdata = response.data
                } else {
                    console.log(response);
                    alert("Ошибка получения данных с сервера о заказе")
                }
            } catch (e){
                console.log(e);
                alert("Ошибка получения данных с сервера о заказе")
            }
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
            let res = await this.getPaymentUrl(this.$route.params.post)
            if (res?.url) {
                window.location.href = res.url
            } else {
                this.$swal.close()
                this.$swal('Возникла неизвестная ошибка, попробуйте еще раз', '', 'error')
            }
        },
        async checkPaymentStatus() {
            if (
                this.orderdata.payment_status == 'pending'
            ) {
                let res = await this.fetchPaymentStatus(this.orderdata.id)
                if(res && res.success){
                    this.orderdata.payment_status = res.payment_status
                    this.orderdata.status = res.status
                }
                this.show_order_message = true
            }
        },
    },
    components: {
        ShopCartItem,
        PageLoader,
        ShopLayout,
        //ShopOrderResultMessage,
        RequestOrderInfo
    },
}*/
</script>
