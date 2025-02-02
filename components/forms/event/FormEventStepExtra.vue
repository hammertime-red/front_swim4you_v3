<script setup>
import FormExtraServicesSet from "~/components/forms/FormExtraServicesSet.vue";
import {computed, inject, provide, ref, watch} from "vue";
import {extraItemTemplate} from "@/helpers/formTemplates";
import {Button} from "~/components/shadcn/ui/button";
import {useToast} from "~/components/shadcn/ui/toast";

const {toast} = useToast()
const emit = defineEmits(['nextStep', 'prevStep'])

const postData = inject("postData");
const orderData = inject("orderData");
const setOrderData = inject('setOrderData')

const form = ref({
    order_id: null,
    event_id: null,
    extra_items: []
})
const loading = ref(false)

function setFormData(payload) {
    form.value.extra_items = []
    if (payload?.id) form.value.order_id = payload.id
    if (payload?.extra_items) {
        form.value.extra_items = payload.extra_items.map(item => {
            return {
                order_extra_item_id: item.id,
                extra_service_id: item.extra_service_id,
                quantity: item.quantity,
                athlete_id: item.athlete_id,
                distance_id: item.distance_id,
                key: item.key,
            }
        })
    }
}

function addExtraItem(payload){
    if(!payload?.extra_service_id) {
        return
    }
    let extra_item = {...extraItemTemplate}
    if(payload?.order_extra_item_id) extra_item.order_extra_item_id = payload?.order_extra_item_id
    if(payload?.extra_service_id) extra_item.extra_service_id = payload?.extra_service_id
    if(payload?.quantity) extra_item.quantity = payload?.quantity
    if(payload?.athlete_id) extra_item.athlete_id = payload?.athlete_id
    if(payload?.distance_id) extra_item.distance_id = payload?.distance_id
    if(payload?.key){
        extra_item.key = payload?.key
    } else {
        extra_item.key = `${extra_item.extra_service_id}__${extra_item.athlete_id}__${extra_item.distance_id}`
    }

    const index = form.value.extra_items.findIndex(item => item.key === extra_item.key)
    if(index !== -1){
        form.value.extra_items[index] = extra_item
    } else {
        form.value.extra_items.push(extra_item)
    }
}

function deleteExtraItem(key){
    form.value.extra_items = form.value.extra_items.filter(item => item.key != key)
}
function changeExtraItemQuantity(key, quantity){
    let index = form.value.extra_items.findIndex(item => item.key === key)
    if(index === -1) return
    form.value.extra_items[index].quantity = quantity
}

watch(orderData, (value) => {
    setFormData(value)
}, {deep: true, immediate: true})

provide('extra_items', computed(() => form.value.extra_items))
provide('addExtraItem', addExtraItem)
provide('deleteExtraItem', deleteExtraItem)
provide('changeExtraItemQuantity', changeExtraItemQuantity)

const hasChange = computed(() => {
    // Если разное количество элементов - значит есть изменения
    if (!orderData?.extra_items?.length && form.value.extra_items.length) {
        return true
    }

    if (orderData?.extra_items?.length !== form.value.extra_items.length) {
        return true
    }

    // Сравниваем каждый элемент
    return form.value.extra_items.some(formItem => {
        const originalItem = orderData.extra_items.find(item =>
            item.extra_service_id === formItem.extra_service_id &&
            item.athlete_id === formItem.athlete_id &&
            item.distance_id === formItem.distance_id
        )

        // Если элемент новый или изменилось количество
        return !originalItem || originalItem.quantity !== formItem.quantity
    })
})

async function onSubmit(method = 'submit'){
    if (!hasChange.value) {
        emit('nextStep')
        return
    }

    loading.value = true
    await fetchAuth('/event/order/store-extra-items', {
        method: 'PUT',
        body: form.value
    }).then((response) => {
        setOrderData(response)
        toast({
            title: 'Дополнительные услуги успешно сохранены',
            variant: 'success',
        })
        console.log(method)
        if(method === 'submit') emit('nextStep')
    }).catch((e) => {
        console.error(e)
    }).finally(() => {
        loading.value = false
    })
    console.log(form.value)
    //emit('nextStep')
}
</script>

<template>
    <div class="grid lg:grid-cols-4 gap-7 mt-10">
        <div class="col-span-3 grid gap-7">

            <div class="form_step">
                <FormExtraServicesSet
                        :items="postData.extra_services"
                        :distances="form.extra_items" />
            </div>

            <div class="fixed bottom-0 left-0 right-0 py-4 bg-white z-2">
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
                                <Button :disabled="loading" class="rounded-full" size="lg" type="button"
                                        variant="primary" @click.prevent="onSubmit('submit')">
                                    <span v-if="!loading">Далее</span>
                                    <Icon v-if="!loading" name="ri:arrow-right-line"/>
                                    <Icon v-else name="svg-spinners:ring-resize"/>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-1">
            <div class="sticky_box grid gap-7">

                <div class="instruction_box sticky_box bg-secondary rounded p-6 text-white mb-4">
                    <p class="font-bold text-accent mb-4">Пожалуйста, внимательно заполните все поля формы и
                        добавьте данные участников для подачи заявки.</p>
                    <p class="mb-4">После оплаты и проверки на указанную в настройках вашего профиля email придет письмо
                        с информацией по заявке.</p>
                    <p class="mb-4">Также вы можете отслеживать статус заявок через раздел
                        <NuxtLink class="text-white underline font-bold" to="/profile">“Мои заявки”</NuxtLink>
                    </p>
                    <Button :disabled="!hasChange || loading" @click.prevent="onSubmit('save')" class="rounded-full w-full h-14" size="lg" variant="accent">
                        <span v-if="!loading">Сохранить</span>
                        <Icon v-else name="svg-spinners:ring-resize"/>
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>