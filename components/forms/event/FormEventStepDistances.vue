<script setup>
import FormClubFieldgroup from "~/components/forms/FormClubFieldgroup.vue";
import {useForm} from "vee-validate";
import {Button} from "~/components/shadcn/ui/button";
import {computed, inject, provide, ref, watch} from "vue";
import FormAthletesSet from "~/components/FormAthletesSet.vue";
import {Alert, AlertTitle} from "~/components/shadcn/ui/alert";
import {defaultAthlete} from "~/types/form/AthleteFieldgroup";
import ExpiredBox from "~/components/forms/ExpiredBox.vue";
import {useToast} from "~/components/shadcn/ui/toast";
import ExpirationBox from "~/components/pages/order_event/ExpirationBox.vue";

const {$swal} = useNuxtApp()
const {toast} = useToast()
const route = useRoute()
const athleteStore = useAthleteStore()

const postData = inject("postData");
const orderData = inject("orderData");
const setOrderData = inject("setOrderData");
const refreshOrderData = inject("refreshOrderData");
const loading = ref(false)

const emit = defineEmits(['nextStep'])

const hasUnreservedDistances = computed(() => {
    return formValues.items.some((item, index) => {
        return !item.distances || !item.distances.length || item.distances.some(distance => !distance.reservation_status || distance.reservation_status === 'draft' || distance.reservation_status === 'not_reserved')
    })
})

async function timeEnd() {
    refreshOrderData()
    $swal(
        'Время бронирования истекло',
        'Неоплаченные дистанции сняты с резерва',
        'warning'
    )
}

provide('disallowed_athletes', postData.value?.athletes ?? [])

const {values: formValues, handleSubmit, setFieldError, setErrors, errors, meta, setValues} = useForm({
    initialValues: {
        club_id: null,
        agent_name: '',
        agent_phone: '',
        agent_email: '',
        items: [{...defaultAthlete}]
    },
})

const validateDistances = (values) => {
    return values.items.some((item, index) => {
        if (!item.distances || item.distances.length === 0) {
            setErrors({
                [`items.${index}`]: 'Добавьте хотя бы одну дистанцию'
            })
            return true
        }
        return false
    })
}

const validateDocuments = (values) => {
    return values.items.some((item, index) => {
        if (item.is_online_request) {
            const athlete = athleteStore.athletes.find(ath => ath.id === item.athlete_id)
            const isDocumentsFull = postData.required_documents.every(req =>
                athlete.documents.some(doc => doc.id === req)
            )
            if (!isDocumentsFull) {
                setErrors({
                    [`items.${index}`]: 'Необходимо добавить все документы или убрать галочку онлайн-допуска'
                })
                return true
            }
        }
        return false
    })
}

const onSubmit = handleSubmit(async (values, context) => {
    if (validateDistances(values)) {
        return false
    }
    if (validateDocuments(values)) {
        return false
    }

    let method = 'POST'
    values.event_id = postData.id
    if (orderData.value) {
        values.order_id = orderData.value.id
        method = 'PUT'
    }

    loading.value = true
    await fetchAuth(`event/order/store/reserve`, {
        method: method,
        body: values,
    }).then((response) => {
        toast({
            title: 'Дистании успешно зарезервированы',
            variant: 'success',
        })
        if (route.name === 'order_event_create') {
            navigateTo({name: 'order_event_update', params: {id: response.id}})
        } else {
            setOrderData(response)
        }
    }).catch((error) => {
        console.log('catch', error)
        context.setErrors({global: error.data?.message, ...error.data.errors})
    }).finally(() => {
        loading.value = false
    })
})

const transformOrderForForm = (order) => {
    const itemsByAthlete = order.order_items.filter(item => item.distance_type === 'distance').reduce((acc, item) => {
        if (!acc[item.athlete_id]) {
            acc[item.athlete_id] = {
                athlete_id: item.athlete_id,
                is_online_request: Boolean(item.is_online_request),
                distances: []
            };
        }

        acc[item.athlete_id].distances.push({
            id: item.id,
            key: item.key,
            distance_id: item.distance_id,
            entrytime: item.entrytime,
            reservation_status: item.reservation_status,
            is_payed: item.is_payed,
            is_system_entrytime: item.is_system_entrytime || false,
        });

        return acc;
    }, {});

    return {
        club_id: order.club_id,
        event_id: order.orderable_id,
        agent_name: order.agent_name,
        agent_phone: order.agent_phone,
        agent_email: order.agent_email,
        items: Object.values(itemsByAthlete)
    };
};

watch(orderData, (value) => {
    if(value){
        setValues(transformOrderForForm(value))
    }
}, {immediate: true, deep: true});

</script>

<template>
    <div class="grid lg:grid-cols-4 gap-7 mt-10">
        <div class="col-span-3 grid gap-7">
            <form class="form_step grid gap-10" @submit="onSubmit" id="distancesForm">

                <FormClubFieldgroup/>

                <FormAthletesSet
                        subtitle="Добавьте необходимое кол-во спортсменов, документы для подачи онлайн-заявки, а также дистанции и заявочное время. В случае, если в базе данных имеется информация о результатах в выбранной дистанции, она проставится автоматически"
                        title="Добавьте спортсменов и дистанции"/>

                <div class="fixed bottom-0 left-0 right-0 py-4 bg-white z-2">
                    <div class="container">
                        <div class="grid grid-cols-4 gap-7">
                            <div class="col-span-3 flex gap-3 items-center justify-between">
                                <div class="">
                                    <Alert v-if="hasUnreservedDistances" variant="warning">
                                        <div class="flex">
                                            <Icon class="mr-2" name="ri:error-warning-line"/>
                                            <AlertTitle class="mb-0 font-bold">Для перехода к следующему шагу необходимо
                                                зарезервировать дистанции
                                            </AlertTitle>
                                        </div>
                                    </Alert>
                                </div>
                                <div class="col-6 col-md-auto">
                                    <Button v-if="hasUnreservedDistances" :disabled="loading" class="rounded-full"
                                            size="lg" type="submit" variant="primary">
                                        <Icon v-show="loading" name="svg-spinners:ring-resize"/>
                                        <span v-show="!loading">Резерв дистанций</span>
                                    </Button>
                                    <Button v-else class="rounded-full" size="lg" type="button"
                                            variant="primary" @click.prevent="emit('nextStep')">
                                        Далее
                                        <Icon name="ri:arrow-right-line"/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </form>
        </div>
        <div class="col-span-1">
            <div class="sticky_box grid gap-7">
                <Button type="submit" form="distancesForm" class="rounded-full w-full h-14" size="lg" variant="primary">
                    Резерв дистанций
                </Button>
                <ExpirationBox v-if="orderData" :order-data="orderData" @time-end="timeEnd" />

                <div class="instruction_box sticky_box bg-secondary rounded p-6 text-white mb-4">
                    <p class="font-bold text-accent mb-4">Пожалуйста, внимательно заполните все поля формы и
                        добавьте данные участников для подачи заявки.</p>
                    <p class="mb-4">После оплаты и проверки на указанную в настройках вашего профиля email придет письмо
                        с информацией по заявке.</p>
                    <p class="mb-4">Также вы можете отслеживать статус заявок через раздел
                        <NuxtLink class="text-white underline font-bold" to="/profile">“Мои заявки”</NuxtLink>
                        .
                    </p>
                    <Button :disabled="loading || !hasUnreservedDistances" type="submit" form="distancesForm" class="rounded-full w-full h-14" size="lg" variant="accent">
                        <Icon v-show="loading" name="svg-spinners:ring-resize"/>
                        <span v-show="!loading">Сохранить</span>
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>