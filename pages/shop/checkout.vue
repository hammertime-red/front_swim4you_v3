<template>
    <div class="my-8">
        <template v-if="shopStore.cart?.length">
            <PageTitle title="Оформление заказа" :show_breadcrumbs="false" />
            <div class="container">
                <p class="font-bold mb-4">
                    Пожалуйста, внимательно проверьте данные перед отправкой.<br />
                    После отправки заявки вы будете перенаправлены на страницу оплаты.
                </p>
                <div class="grid grid-cols-12 gap-6">
                    
                    <div class="col-span-12 lg:col-span-5">
                        <div class="content_box p-4 flex flex-col rounded-0 h-full">
                            <h2 class="title_block mb-4">Состав заказа</h2>
                            <div class="cart_items mb-4">
                                <ShopCartItem v-for="(item, i) in shopStore.cart" :item="item" :key="i" />
                            </div>
                            <div
                                class="cart_summ flex items-center justify-between font-bold fs-6 mt-auto">
                                <p class="mb-0 fs-4">Итого:</p>
                                <p class="mb-0 fs-4 text-positive">{{shopStore.summ}} ₽</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-span-12 lg:col-span-7">
                        <Form @submit="onSubmit" v-slot="{errors}" class="grid grid-cols-2 gap-6">
                            
                            <div class="col-span-2 lg:col-span-1">
                                <div class="content_box p-4">
                                    <div class="content_box__header flex justify-between items-center mb-3 relative z-2">
                                        <h2 class="title_block">Плательщик</h2>
                                    </div>

                                    <div class="grid gap-4">
                                        <TextField
                                                name="payers_name"
                                                label="ФИО плательщика"
                                                required
                                                :initial-value="userStore.userdata?.name || 'Тест Тестович'"
                                        />
                                        <PhoneField
                                                name="payers_phone"
                                                label="Телефон плательщика"
                                                required
                                                :initial-value="userStore.userdata?.phone || '+7 (777) 777 7777'"
                                        />
                                        <EmailField
                                                name="payers_email"
                                                label="Email плательщика"
                                                required
                                                :initial-value="userStore.userdata?.email || 'info@waa.kz'"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div v-if="checkoutData?.payment_methods.length" class="col-span-2 lg:col-span-1">
                                <div class="content_box p-4 h-full">
                                    <div class="content_box__header flex justify-between items-center mb-3 relative z-2">
                                        <h2 class="title_block">Способ оплаты</h2>
                                    </div>
                                    <PaymentMethodField
                                            name="payment_method_id"
                                            :options="checkoutData.payment_methods"
                                            option-label="display_name"
                                            option-value="id"
                                            option-description="display_description"
                                    />
                                </div>
                            </div>
                            <div v-if="checkoutData?.allowed_events.length" class="col-span-2">
                                <div class="content_box p-4 h-full">
                                    <div class="content_box__header flex justify-between items-center mb-3 relative z-2">
                                        <h2 class="title_block">Забрать заказ</h2>
                                    </div>
                                    <SelectField
                                            :options="checkoutData?.allowed_events"
                                            option-label="name"
                                            option-value="id"
                                            required
                                            name="event_id"
                                            label="Выберите мероприятие, где вам удобно забрать заказ"
                                    />
                                </div>
                            </div>
                            <div v-if="checkoutData?.accept_checks" class="col-span-2">
                                <div class="content_box p-4 py-6 rounded-0">
                                    <AgreementField :options="checkoutData.accept_checks" option-label="item" class="mb-6" />
                                    <GlobalErrorAlert v-if="errors.global" :error="errors.global" class="form_error_message mb-6" />
                                    <Button
                                            variant="primary"
                                            size="lg"
                                            type="submit"
                                            class="rounded-xl uppercase px-12"
                                            :disabled="loading">
                                        Перейти к оплате
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="max-w-[600px] mx-auto px-4 text-center h-full flex-items-center">
                <div class="">
                    <Icon name="line-md:compass-loop" size="120" class="text-primary-200" />
                    <p class="font-bold font-oswald uppercase text-4xl mb-4">Ваша корзина пока пуста</p>
                    <p class="text-sub max-w-[360px] mx-auto">Пожалуйста, добавьте товары в корзину перед оформлением заказа</p>
                </div>
                
            </div>
        </template>
    </div>
</template>

<script setup>
import ShopCartItem from '~/components/UI/ShopCartItem.vue'
import PageTitle from '~/components/PageTitle.vue'
import TextField from "~/components/UI/Fields/TextField.vue";
import PhoneField from "~/components/UI/Fields/PhoneField.vue";
import EmailField from "~/components/UI/Fields/EmailField.vue";
import SelectField from "~/components/UI/Fields/SelectField.vue";
import PaymentMethodField from "~/components/UI/Fields/PaymentMethodField.vue";
import {Form} from "vee-validate";
import AgreementField from "~/components/UI/Fields/AgreementField.vue";
import {Button} from "~/components/shadcn/ui/button";
import GlobalErrorAlert from "~/components/forms/GlobalErrorAlert.vue";

definePageMeta({
    name: 'shop_checkout'
})

const shopStore = useShopStore()
const userStore = useUserStore()
const { $swal } = useNuxtApp()

const {data: checkoutData} = useAsyncData('checkout_data', async () => {
    return await fetchData('/shop/checkout', {
        method: 'GET',
    }).then(res => res).catch(err => console.error(err));
})

async function onSubmit(values, context) {
    const loading  = await $swal.loading(
        'Перенаправление на форму оплаты',
        'Пожалуйста, не закрывайте страницу')
    
    const request = {
        items: shopStore.cart.map((item) => {
            return {
                id: item.id,
                quantity: item.quantity,
            }
        }),
        ...values,
    }
    
    if(userStore.isAuthenticated) {
        await fetchAuth('/shop/order/create', {
            method: 'POST',
            body: request,
        }).then(async (response) => {
            if(response.payment_url){
                shopStore.clearCart()
                await nextTick()
                navigateTo(response.payment_url, {
                    external: true
                })
            }
        }).catch((error) => {
            console.log(error.data)
            context.setErrors({global: error.data?.message})
        }).finally(() => {
            loading.close()
        })
    } else {
        await fetchData('/shop/order/create/guest', {
            method: 'POST',
            body: request,
        }).then(async (response) => {
            if(response.payment_url){
                shopStore.clearCart()
                await nextTick()
                navigateTo(response.payment_url, {
                    external: true
                })
            }
        }).catch((error) => {
            console.log(error.data)
            context.setErrors({global: error.data?.message, ...error.data.errors})
        }).finally(() => {
            loading.close()
        })
    }
}

/*onMounted(async () => {
    await setEvents()
    form_data.value.items = shopStore.cart
    if(!form_data.value.items.length && (!localStorage.getItem('shop_cart') || _.isEmpty(localStorage.getItem('shop_cart')))) {
        $swal('Ваша корзина пуста', '', 'danger')
        router.back()
    }
})*/

/*const sendOrder = (status) => {
    if(hasErrors.value || hasErrorsAccept.value) {
        show_errors.value = true
        nextTick(() => {
            document.querySelector('.invalid').focus()
        })
    } else {
        $swal({
            title: 'Перенаправление на форму оплаты',
            text: 'Пожалуйста, не закрывайте страницу',
            icon: 'info',
            allowOutsideClick: false,
            allowEnterKey: false,
            showConfirmButton: false,
            didOpen: () => {
                $swal.showLoading()
            }
        })
        storeOrder('pending_payment')
    }
}*/

/*const storeOrder = async () => {
    form_data.value.items = shopStore.cart
    try {
        const res = await api.post(process.env.VUE_APP_BASE_URL+'shop/order/create', form_data.value)
        if(res.data?.success) {
            store.commit('shop/clearCart')
            setTimeout(() => {
                window.location.href = res.data.url
            }, 500)
        } else {
            const message = res.data.message || 'Возникла неизвестная ошибка, попробуйте еще раз'
            $swal(message, '', 'error')
        }
    } catch(error) {
        if(error.response?.data.message) {
            $swal(error.response.data.message, '', 'danger')
        }
    }
}*/



</script>
