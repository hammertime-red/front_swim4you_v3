<template>
<!--    <PageLoader v-if="loading" />-->
    <div class="mt-12">
        <div class="container">
            <div class="flex justify-between mb-12">
                <h1 class="font-oswald text-4xl uppercase">Заявка</h1>
                <AppBreadcrumbs class="hidden lg:block" />
            </div>
            
            <OrderEvent :order-data="orderData" :post-data="postData" @timeEnd="refreshOrderData"/>
        </div>
        
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useGlobalStore } from '~/store/globalStore.js'
import PageLoader from '../components/PageLoader.vue'
import OrderResultMessage from '../components/OrderResultMessage'
import PageTitle from '../components/PageTitle.vue'
import PageAlertBox from '../components/PageAlertBox.vue'
import RequestOrderInfo from '../components/RequestOrderInfo.vue'
import OrdersList from '../components/request/OrdersList.vue'
import SportsmensTable from '~/components/request/SportsmensTable.vue'
import RequestSidebarBox from '../components/RequestSidebarBox.vue'
import WithSidebarLayout from '../layouts/WithSidebarLayout.vue'
import EstafetasTable from '~/components/request/EstafetasTable.vue'
import AdditionalData from '~/components/request/AdditionalData.vue'
import OrderEvent from "~/components/pages/order_event/OrderEvent.vue"
import AppBreadcrumbs from "~/components/layout/AppBreadcrumbs.vue"

definePageMeta({
    name: 'order_event'
})

const route = useRoute()
const { setSegments } = useBreadcrumbs()

setSegments([
    {
        name: 'Мой аккаунт',
        path: { name: 'profile' },
        current: false
    },
    {
        name: 'Заявка',
        path: null,
        current: true
    }
])

const loading = ref(false)

const {data: orderData, refresh: refreshOrderData} = await useAsyncData(
    `order_event-${route.params.id}`,
    () => fetchOrderData(),
)

const {data: postData, refresh: refreshPostData} = await useAsyncData(
    `order_event_form_post-${orderData.value.orderable_id}`,
    () => fetchPostData(),
    {
        server: true,
    }
)

async function fetchOrderData(){
    loading.value = true
    return await fetchAuth(`/event/order/${route.params.id}`, {
        method: 'GET',
    }).then((response) => {
        return response
    }).catch((e) => {
        console.error(e)
        return {}
    }).finally(() => {
        loading.value = false
    })
}

async function fetchPostData(){
    loading.value = true
    return await fetchAuth(`/form/event/${orderData.value.orderable_id}`, {
        method: 'GET',
    }).then((response) => {
        return response
    }).catch((e) => {
        console.error(e)
        return {}
    }).finally(() => {
        loading.value = false
    })
}

/*const props = defineProps({
    postData: {
        type: Object,
        default: () => ({})
    },
    orderData: {
        type: Object,
        default: () => ({})
    }
})*/

const store = useStore()
const globalStore = useGlobalStore()

// Состояние
const paymentMethodDesc = ref(null)
const showOrderMessage = ref(false)


// Vuex геттеры
/*const athletes = computed(() => store.getters['athletes/getAthletes'])
const distanceItems = computed(() => store.getters['order/DISTANCE_ITEMS'])
const relayItems = computed(() => store.getters['order/RELAY_ITEMS'])
const extraItems = computed(() => store.getters['order/EXTRA_ITEMS'])
const stage = computed(() => store.getters['events/getFormStagePost'])*/

// Вычисляемые свойства
/*const paymentSumm = computed(() => {
    if (props.orderData.already_paid) {
        return props.orderData.summ - props.orderData.already_paid
    }
    return props.orderData.summ
})

const otherAthleteIds = computed(() => {
    const existAthletes = athletes.value.map(athlete => athlete.id)
    return distanceItems.value
        .map(item => item.athlete_id)
        .filter(athleteId => !existAthletes.includes(athleteId))
})*/

// Методы
const toPayment = async () => {
    globalStore.$swal({
        title: 'Перенаправление на форму оплаты',
        text: 'Пожалуйста, не закрывайте страницу',
        icon: 'info',
        allowOutsideClick: false,
        allowEnterKey: false,
        showConfirmButton: false,
        didOpen: () => {
            globalStore.$swal.showLoading()
        }
    })

    const res = await store.dispatch('order/getPaymentUrl', props.orderData.id)
    if (res?.url) {
        window.location.href = res.url
    } else {
        globalStore.$swal.close()
        globalStore.$swal('Возникла неизвестная ошибка, попробуйте еще раз', '', 'error')
    }
}

const setExpire = async () => {
    await store.dispatch('order/expireOrder', props.orderData.id)
    globalStore.$swal(
        'Время бронирования истекло',
        'Неоплаченные дистанции сняты с резерва',
        'warning'
    )
    // Примечание: activeStep нужно определить или передать через props
    activeStep.value = 'distances'
}

const checkPaymentStatus = async () => {
    if (props.postData.first_status === 'pending_payment' && props.orderData.payment_status === 'pending') {
        const res = await store.dispatch('order/fetchPaymentStatus', props.orderData.id)
        console.log(res)
        showOrderMessage.value = true
    }
}

// Хук жизненного цикла
/*onMounted(async () => {
    if (otherAthleteIds.value.length) {
        await store.dispatch('athletes/fetchAthletesByIds', otherAthleteIds.value)
    }
    await checkPaymentStatus()
    isLoaded.value = true
})*/
</script>

<style>
</style>
