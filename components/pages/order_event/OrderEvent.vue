<script setup>
import Avatar from "~/components/UI/Avatar.vue";
import {datesRange, inDateRange} from "~/services/dates";
import PaymentStatusBadge from "~/components/UI/PaymentStatusBadge.vue";
import {Button} from "~/components/shadcn/ui/button";
import OrderStatusBadge from "~/components/UI/OrderStatusBadge.vue";
import PaymentForm from "~/components/pages/order_event/PaymentForm.vue";
import TimeCounter from "~/components/UI/TimeCounter.vue";
import {parse, parseISO} from "date-fns";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import DistanceStatus from "~/components/forms/DistanceStatus.vue";
import {Badge} from "~/components/shadcn/ui/badge";
import ExpirationBox from "~/components/pages/order_event/ExpirationBox.vue";

const props = defineProps({
    orderData: {
        type: Object,
        required: true
    },
    postData: {
        type: Object,
        required: true
    },
    isForm: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['timeEnd', 'prevStep'])

const globalStore = useGlobalStore()
const athleteStore = useAthleteStore()

const dates = computed(() => {
    return datesRange(props.postData.start_event_date, props.postData.end_event_date)
})

const distancesTable = computed(() => {
    return props.orderData.order_items.filter(item => item.distance_type === 'distance' && (item.reservation_status === 'reserved' || item.is_payed)).map(item => {
        const athlete = athleteStore.athletes.find(ath => ath.id === item.id)
        item.athlete_avatar = athlete?.avatar || null
        return item
    })
})

const relaysTable = computed(() => {
    return props.orderData.order_items.filter(item => item.distance_type === 'relay')
})

const amountToPay = computed(() => {
    console.log(props.orderData)
    if(props.orderData.already_paid){
        return props.orderData.summ - props.orderData.already_paid
    }
    return props.orderData.summ
})

function getRelayName(id) {
    const distance = props.postData.relays.find(item => item.id === id)
    return distance?.name
}

const hasExpiration = computed(() => {
    return props.orderData.expiration_at &&
        parseISO(props.orderData.expiration_at) >
        parse(globalStore.server_time, 'yyyy-MM-dd HH:mm:ss', new Date())
})

const hasReservedDistances = computed(() => {
    return props.orderData.order_items.some(item => item.reservation_status === 'reserved' || item.is_payed)
})

const hasUnpaidItems = computed(() => {
    return props.orderData.order_items.some(item => !item.is_payed) || props.orderData.extra_items.some(item => !item.is_payed)
})

const isRegistrationTime = computed(() => {
    return inDateRange(props.postData.start_registration_date, props.postData.end_registration_date)
})

const submitMode = computed(() => {
    if(/*!hasUnpaidItems.value ||*/ props.orderData.status === 'rejected' || !isRegistrationTime.value) return null
    
    if(amountToPay.value > 0){
        return 'pay'
    }
    if(props.isForm){
        return 'send'
    }
    return null
})

</script>

<template>
    <div class="grid lg:grid-cols-4 gap-7 mt-10">
        <div class="col-span-1 md:col-span-3 grid gap-7 order-2 md:order-1">
            <div class="grid gap-7 mb-12">
                <div class="content_box px-4 py-6">
                    <div class="content_box__header flex justify-between items-center mb-3 relative z-2">
                        <h2 class="font-oswald font-bold text-2xl uppercase">Заявка #{{ orderData.id }}</h2>
                    </div>
                    <div class="flex flex-wrap gap-7">
                        <div v-if="postData.name && postData.id" class="text-sm">
                            <p class="text-sub mb-1">Мероприятие</p>
                            <NuxtLink :to="{name: 'event', params: {slug: postData.slug}}"
                                      class="mb-0 font-bold text-primary-500">
                                {{ postData.name }}
                            </NuxtLink>
                        </div>
                        <div v-if="orderData.created_at" class="text-sm">
                            <p class="text-sub mb-1">Дата создания</p>
                            <p class="mb-0">{{ formatDate(orderData.created_at) }}</p>
                        </div>
                        <div v-if="postData.event_address" class="text-sm ">
                            <p class="text-sub mb-1">Место проведения</p>
                            <p class="mb-0">
                                {{ postData.event_address }}
                            </p>
                        </div>
                        <div v-if="dates" class="text-sm">
                            <p class="text-sub mb-1">Сроки проведения</p>
                            <p class="mb-0">
                                {{ dates }}
                            </p>
                        </div>
                    </div>
                </div>

                <div v-if="distancesTable.length" class="content_box py-6">
                    <div class="content_box__header flex justify-between items-center mb-6 relative px-4">
                        <h2 class="font-oswald font-bold text-2xl uppercase">Атлеты и дистанции</h2>
                    </div>

                    <DataTable
                        :value="distancesTable"
                        size="lg"
                        rowGroupMode="subheader"
                        groupRowsBy="athlete_name"
                    >
                        <template #groupheader="{data}">
                            <div class="flex items-center text-main">
                                <Avatar :class="'me-2'" :name="data.athlete_name" :src="data.athlete_avatar"/>
                                <span class="font-bold">{{ data.athlete_name }}</span>
                            </div>
                        </template>
                        <Column field="athlete_name" header="Атлет" class="text-sm text-main"></Column>
                        <Column field="distance_stroke" header="Дистанция" class="text-sm text-main"></Column>
                        <Column field="entrytime" header="Заявочное время" class="text-sm text-main"></Column>
                        <Column field="is_online_request" header="Онлайн-допуск" class="text-sm text-main">
                            <template #body="{ data }">
                                <Icon v-if="data.is_online_request" class="text-positive" name="ri:checkbox-circle-line" size="24"/>
                            </template>
                        </Column>
                        <Column field="reservation_status" header="Статус бронирования" class="text-sm text-main">
                            <template #body="{ data }">
                                <DistanceStatus
                                        :status="data.reservation_status"
                                        :is_payed="data.is_payed"
                                        class="h-full"
                                />
                            </template>
                        </Column>
                        <Column field="price" header="Цена" class="text-sm text-main">
                            <template #body="{ data }">
                                {{data.price}} ₽
                            </template>
                        </Column>
                    </DataTable>
                </div>
                
                <div v-if="relaysTable.length" class="content_box  py-6">
                    <div class="content_box__header flex justify-between items-center mb-6 relative px-4">
                        <h2 class="font-oswald font-bold text-2xl uppercase">Эстафеты</h2>
                    </div>
                    <DataTable
                            :value="relaysTable"
                            size="lg"
                    >
                        <Column field="distance_id" header="Название" class="text-sm text-main">
                            <template #body="{ data }">
                                <span class="font-bold">{{ getRelayName(data.distance_id) }}</span>
                            </template>
                        </Column>
                        <Column field="quantity" header="Количество" class="text-sm text-main"></Column>
                        <Column field="is_payed" header="Статус" class="text-sm text-main">
                            <template #body="{ data }">
                                <Badge v-if="data.is_payed" class="bg-positive text-white">Оплачен</Badge>
                                <Badge v-else class="bg-accent text-main">Ожидает оплаты</Badge>
                            </template>
                        </Column>
                        <Column field="price" header="Цена" class="text-sm text-main">
                            <template #body="{ data }">
                                {{data.price}} ₽
                            </template>
                        </Column>
                        <Column field="summ" header="Стоимость" class="text-sm text-main">
                            <template #body="{ data }">
                                {{data.price * data.quantity}} ₽
                            </template>
                        </Column>
                    </DataTable>
                </div>

                <div v-if="orderData.extra_items.length" class="content_box  py-6">
                    <div class="content_box__header flex justify-between items-center mb-6 relative px-4">
                        <h2 class="font-oswald font-bold text-2xl uppercase">Дополнительные услуги</h2>
                    </div>
                    <DataTable
                            :value="orderData.extra_items"
                            size="lg"
                    >
                        <Column field="extra_service_name" header="Название" class="text-sm text-main">
                            <template #body="{ data }">
                                <span class="font-bold">{{ data.extra_service_name }}</span>
                            </template>
                        </Column>
                        <Column field="athlete_name" header="Атлет" class="text-sm text-main"></Column>
                        <Column field="distance_stroke" header="Дистанция" class="text-sm text-main"></Column>
                        <Column field="status" header="Статус выполнения" class="text-sm text-main">
                            <template #body="{ data }">
                                <Badge v-if="data.status === 'completed'" class="bg-positive text-white">Завершено</Badge>
                                <Badge v-else class="bg-accent text-main">Не завершено</Badge>
                            </template>
                        </Column>
                        <Column field="is_payed" header="Статус оплаты" class="text-sm text-main">
                            <template #body="{ data }">
                                <Badge v-if="data.is_payed" class="bg-positive text-white">Оплачен</Badge>
                                <Badge v-else class="bg-accent text-main">Ожидает оплаты</Badge>
                            </template>
                        </Column>
                        <Column field="price" header="Цена" class="text-sm text-main">
                            <template #body="{ data }">
                                {{data.price}} ₽
                            </template>
                        </Column>
                        <Column field="summ" header="Стоимость" class="text-sm text-main">
                            <template #body="{ data }">
                                {{data.price * data.quantity}} ₽
                            </template>
                        </Column>
                    </DataTable>
                </div>

                <div class="content_box px-4 py-6">
                    <div class="content_box__header flex justify-between items-center mb-3 relative z-2">
                        <h2 class="font-oswald font-bold text-2xl uppercase">Данные клуба</h2>
                    </div>
                    <div class="grid gap-7">
                        <div class="flex flex-wrap gap-7">
                            <div v-if="orderData.club_name" class="text-sm">
                                <p class="text-sub mb-1">Клуб</p>
                                <p class="font-bold">{{ orderData.club_name }}</p>
                            </div>
                            <div v-if="orderData.club_shortname" class="text-sm">
                                <p class="text-sub mb-1">Короткое название</p>
                                <p class="">{{ orderData.club_shortname }}</p>
                            </div>
                            <div v-if="orderData.club_state" class="text-sm ">
                                <p class="text-sub mb-1">Код региона</p>
                                <p class="mb-0">{{ orderData.club_state }}</p>
                            </div>
                            <div v-if="orderData.club_city" class="text-sm ">
                                <p class="text-sub mb-1">Город</p>
                                <p class="mb-0">{{ orderData.club_city }}</p>
                            </div>
                        </div>
                        <div class="border-t border-slate-200"></div>
                        <div class="flex flex-wrap gap-7">
                            <div v-if="orderData.agent_name" class="text-sm">
                                <p class="text-sub mb-1">ФИО представителя</p>
                                <p class="">{{ orderData.agent_name }}</p>
                            </div>
                            <div v-if="orderData.agent_phone" class="text-sm">
                                <p class="text-sub mb-1">Телефон представителя</p>
                                <p class="">{{ orderData.agent_phone }}</p>
                            </div>
                            <div v-if="orderData.agent_email" class="text-sm ">
                                <p class="text-sub mb-1">Email представителя</p>
                                <p class="mb-0">{{ orderData.agent_email }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="" id="order_list">
                    <div class="grid md:grid-cols-2 gap-7">
                        <div class="">
                            <div class="content_box p-4">
                                <div class="content_box__header flex justify-between items-center mb-3 relative z-2">
                                    <h2 class="title_block mb-2 text-sub">Информация о заказе</h2>
                                </div>
                                <div class="order_info flex gap-7 mb-3">
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
<!--                                    <div v-if="orderData.summ > orderData.already_paid" class="col-auto text-sm">
                                        <p class="text-sub mb-1">Статус оплаты:</p>
                                        <PaymentStatusBadge :status="orderData.payment_status" />
                                    </div>-->
                                </div>
                            </div>
                        </div>
                        <div class="">
                            <PaymentForm v-if="submitMode" :post-data="postData" :order-id="orderData.id" :amount-to-pay="amountToPay" :submit-mode="submitMode" />
                        </div>
                    </div>
                </div>

<!--                <div class="">
                    <p class="font-oswald font-regular text-3xl uppercase mb-3">Связанные заказы</p>
                    <div class="grid md:grid-cols-2 gap-7">
                    </div>
                </div>-->

            </div>
        </div>
        <div class="col-span-1 order-1 md:order-2">
            <ExpirationBox :order-data="orderData" :submit-mode="submitMode" class="sticky_box mb-4" />
        </div>
        <div v-if="isForm" class="fixed bottom-0 left-0 right-0 py-4 bg-white z-2">
            <div class="container">
                <div class="grid grid-cols-4 gap-7">
                    <div class="col-span-3 flex gap-3 items-center justify-between">
                        <div class="col-6 col-md-auto">
                            <Button class="rounded-full" size="lg" type="button"
                                    variant="outline" @click.prevent="emit('prevStep')">
                                <Icon name="ri:arrow-left-line"/>
                                Назад
                            </Button>
                        </div>
                        <div class="col-6 col-md-auto">
                            <Button v-if="submitMode" class="rounded-full" size="lg" type="submit" form="payment_form" variant="primary">
                                <span>{{submitMode === 'pay' ? 'Перейти к оплате' : 'Отправить'}}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>