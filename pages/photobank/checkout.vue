<template>
    <photobank-layout>
        <template #content>
            <PageTitle title="Оформление заказа" :show_breadcrumbs="false" />
            <div class="container">
                <p class="font-bold mb-4">
                    Пожалуйста, внимательно проверьте данные перед отправкой.<br />
                    После отправки заявки вы будете перенаправлены на страницу оплаты.
                </p>
                <div class="row g-4">
                    <div class="col-lg-5">
                        <div class="content_box p-4">
                            <h2 class="title_block mb-4">Состав заказа</h2>
                            <div class="cart_items mb-4">
                                <PhtCartItem v-for="(item, i) in getCartItems" :item="item" :key="i" :deleteBtn="false" :index="i" />
                            </div>
                            <div
                                class="cart_summ flex items-center justify-between font-bold fs-6">
                                <p class="mb-0">Итого:</p>
                                <p class="mb-0">{{summ}} ₽</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-7">
                        <div class="row g-4 mb-4">
                            <div class="col-md-6">
                                <FormPayerFieldgroup
                                    v-model:payers_name="form_data.payers_name"
                                    v-model:payers_phone="form_data.payers_phone"
                                    v-model:payers_email="form_data.payers_email"
                                    v-model:has_errors="has_errors"
                                    :show_errors="show_errors"
                                    style="height: 100%"
                                    class="mb-sm-0" />
                            </div>
                            <div class="col-md-6">
                                <FormPaymentMethods
                                    v-model="form_data.payment_method"
                                    :send_order_btn="false"
                                    :has_errors="hasErrors"
                                    :accept_methods="[1]"
                                    @sendOrder="sendOrder()"
                                    style="height: 100%"
                                    class="mb-sm-0" />
                            </div>
                        </div>

                        <div class="content_box p-4 mb-4">
                            <div v-for="(item, i) in accept_checks" :key="i" class="form-check">
                                <input
                                    v-model="accept_checks[i].check"
                                    :id="'accept_' + i"
                                    class="form-check-input ml-2"
                                    :class="show_errors && !accept_checks[i].check ? 'invalid' : ''"
                                    type="checkbox"
                                    required />
                                <label
                                    class="form-check-label text-sm"
                                    :class="show_errors && !accept_checks[i].check ? 'text-red-500' : ''"
                                    :for="'accept_' + i"
                                    v-html="item.text">
                                </label>
                            </div>
                            <button
                                @click.prevent="sendOrder()"
                                class="btn btn-lg btn-primary btn-primary-shadow rounded-pill uppercase px-5"
                                :disabled="hasErrors">
                                Перейти к оплате
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #offcanvas></template>
    </photobank-layout>
</template>

<script>
import FormPaymentMethods from '~/components/forms/FormPaymentMethods.vue'
import FormPayerFieldgroup from '~/components/forms/FormPayerFieldgroup.vue'
import PageTitle from '~/components/PageTitle.vue'
import PhtCartItem from '~/components/cards/PhtCartItem.vue'
import PhotobankLayout from '../../layouts/PhotobankLayout.vue'
import api from '@/store/api'

export default {
    data() {
        return {
            form_data: {
                type: 'photobank',
                payers_name: null,
                payers_phone: null,
                payers_email: null,
                event_id: null,
                event_child_id: null,
                payment_method: 1,
                items: []
            },
            has_errors: false,
            show_errors: false,
            accept_checks: [
                {
                    text: '<p>С <a href="/page/8" class="text-dark" target="_blank">политикой конфиденциальности</a> ознакомлен и согласен</p>',
                    check: false,
                },
            ],
        }
    },
    computed: {
        CART_IDS(){
            return this.$store.getters['photobank/getCart']
        },
        getCartItems(){
            return this.$store.getters['photobank/getCartItems']
        },
        summ(){
            return this.$store.getters['photobank/getCartSumm'];
        },
        hasErrors() {
            if (!this.form_data.payers_name || !this.form_data.payers_phone || !this.form_data.payers_email || this.hasErrorsAccept) {
                return true
            } else {
                return false
            }
        },
        hasErrorsAccept(){
            return !!this.accept_checks.find(el => el.check == false)
        }
    },
    watch: {
        CART_IDS: {
            handler(cart){
                this.form_data.items = cart
            },
            deep: true
        }
    },
    async mounted() {
        setMeta(
            'Оформление заказа | Swim4you.ru',
            null,
            null,
            false
        )

        this.form_data.items = this.CART_IDS

        if(_.isEmpty(this.form_data.items) && (!localStorage.getItem('cart') || _.isEmpty(localStorage.getItem('cart')))){
            this.$swal('Ваша корзина пуста', '', 'danger')
            this.$router.go(-1)
        }

        if(_.isEmpty(this.getCartItems)){
            await this.$store.dispatch('photobank/fetchCartPhotos')
        }
    },
    methods: {
        sendOrder(status){
            if(this.hasErrors || this.hasErrorsAccept){
                this.show_errors = true
                this.$nextTick(() => {this.$el.querySelector('.invalid').focus()})
            } else {
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
                this.storeOrder('pending_payment')
            }
        },
        storeOrder(status = 'draft'){
            this.form_data.status = status
            api.post(process.env.VUE_APP_BASE_URL+'order/create', this.form_data).then(res => {
                if(res.data && res.data.success){
                    this.$store.commit('photobank/clearCart')
                    setTimeout(() => {
                        window.location.href = res.data.url;
                    }, 500)
                }else{
                    console.log(res.data)
                    this.$swal('Возникла неизвестная ошибка, попробуйте еще раз', '', 'danger')
                }
            }).catch(error => {
                console.log('Catch', error, error.response)
                if(error.response && error.response.data.message){
                    this.$swal(error.response.data.message, '', 'danger')
                }
            })
        },
    },
    components: {
        PhotobankLayout,
        PhtCartItem,
        PageTitle,
        FormPayerFieldgroup,
        FormPaymentMethods,
    },
}
</script>

<style></style>
