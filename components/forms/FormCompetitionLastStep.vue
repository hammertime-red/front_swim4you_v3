<template>
    <p class="font-oswald text-uppercase text-accent fs-3 font-bold mb-1">
        Заявка сформирована
    </p>
    <p class="font-bold">
        Пожалуйста, внимательно проверьте данные перед отправкой.<br />
        После отправки заявки вы будете перенаправлены на страницу оплаты.
    </p>
    <div class="row g-3 mb-5">
        <div class="col-md-6">
<!--            <OrdersList
                :distances="distanceItems"
                :relay_races="relayItems"
                :extra_items="extraItems"
                :postdata="stage"
                :summ="orderData.summ"
                :already_paid="orderData.already_paid"
            />-->
        </div>

        <div class="col-md-6">
<!--            <FormPayerFieldgroup
                    v-model:payers_name="payers_name"
                    v-model:payers_phone="payers_phone"
                    v-model:payers_email="payers_email"
                    v-model:has_errors="has_errors"
            />-->
<!--            <FormPaymentMethods
                    v-if="stage.first_status === 'pending_payment' && !hide_payment_methods"
                    v-model="payment_method"
                    :accept_methods="[1]"
                    :send_order_btn="true"
                    :has_errors="hasErrors"
                    @sendOrder="emit('sendOrder')"
            />-->
        </div>
    </div>

    <div class="content_box p-4 mb-4">
        <div class="content_box__header flex justify-between items-center mb-3 relative z-2">
            <h2 class="title_block mb-2">Данные о мероприятии</h2>
        </div>
        <div class="row g-4">
            <div v-if="stage.name && stage.id" class="col-md-4 small">
                <p class="text-muted mb-1">Мероприятие</p>
                <router-link :to="`/stage/${stage.id}`" class="mb-0 font-bold">
                    {{ stage.name }}
                </router-link>
            </div>
            <div v-if="stage.location_address" class="col-md-4 small">
                <p class="text-muted mb-1">Место проведения</p>
                <p class="mb-0">{{ stage.location_address }}</p>
            </div>
            <div v-if="stage.dates" class="col-md-4 small">
                <p class="text-muted mb-1">Сроки проведения</p>
                <p class="mb-0">{{ stage.dates }}</p>
            </div>
        </div>
    </div>

<!--    <SportsmensTable
            :distances="true"
            :documents="true"
            :short_swimtime="false"
    />-->
<!--    <EstafetasTable
            v-if="relayItems.length"
            :items="relayItems"
    />-->
<!--    <AdditionalData
            :club="{
            name: orderData.club_name,
            shortname: orderData.club_shortname,
            state: orderData.club_state,
        }"
            :contacts="{
            name: orderData.agent_name,
            phone: orderData.agent_phone,
            email: orderData.agent_email,
        }"
    />-->
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import FormPaymentMethods from '../../components/forms/FormPaymentMethods'
import FormPayerFieldgroup from './FormPayerFieldgroup'
import AdditionalData from '../../components/request/AdditionalData'
import EstafetasTable from '../../components/request/EstafetasTable'
import SportsmensTable from '../../components/request/SportsmensTable'
import OrdersList from '../../components/request/OrdersList'

const props = defineProps({
    payers_name: { type: String, default: '' },
    payers_phone: { type: String, default: '' },
    payers_email: { type: String, default: '' },
    payment_method: { type: Number, default: 1 },
    has_errors: { type: Boolean, default: false },
    hide_payment_methods: { type: Boolean, default: false }
})

const emit = defineEmits([
    'update:has_errors',
    'update:payers_name',
    'update:payers_phone',
    'update:payers_email',
    'update:payment_method',
    'sendOrder'
])

const store = useStore()

// Vuex getters
const orderData = computed(() => store.getters['order/getOrderData'])
const distanceItems = computed(() => store.getters['order/DISTANCE_ITEMS'])
const relayItems = computed(() => store.getters['order/RELAY_ITEMS'])
const extraItems = computed(() => store.getters['order/EXTRA_ITEMS'])
const stage = computed(() => store.getters['events/getFormStagePost'])

// Computed properties
const hasErrors = computed(() => !props.payers_name || !props.payers_phone || !props.payers_email)

const athleteIds = computed(() =>
    extraItems.value
        .map(item => item.athlete_id)
        .filter(Boolean)
)

// v-model computed properties
const payers_name = computed({
    get: () => props.payers_name,
    set: value => emit('update:payers_name', value)
})

const payers_phone = computed({
    get: () => props.payers_phone,
    set: value => emit('update:payers_phone', value)
})

const payers_email = computed({
    get: () => props.payers_email,
    set: value => emit('update:payers_email', value)
})

const payment_method = computed({
    get: () => props.payment_method,
    set: value => emit('update:payment_method', value)
})

const has_errors = computed({
    get: () => props.has_errors,
    set: value => emit('update:has_errors', value)
})
</script>