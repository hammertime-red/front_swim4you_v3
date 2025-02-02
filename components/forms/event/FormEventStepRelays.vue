<script setup>
import FormRelayRacesSet from "~/components/forms/FormRelayRacesSet.vue";
import {relayItemTemplate} from "@/helpers/formTemplates";
import {Button} from "~/components/shadcn/ui/button";
import ExpiredBox from "~/components/forms/ExpiredBox.vue";
import {useToast} from "~/components/shadcn/ui/toast";

const {toast} = useToast()
const emit = defineEmits(['nextStep', 'prevStep'])

const postData = inject("postData");
const orderData = inject("orderData");
const setOrderData = inject('setOrderData')

const form = ref({
    order_id: null,
    relay_items: []
})
const loading = ref(false)

function setFormData(payload) {
    form.value.relay_items = []
    if (payload?.id) form.value.order_id = payload.id

    if (payload?.order_items) {
        form.value.relay_items = payload.order_items.filter(item => item.distance_type === 'relay').map(item => {
            return {
                distance_id: item.distance_id,
                key: item.key,
                order_item_id: item.id,
                quantity: item.quantity,
            }
        })
    }
}

function addRelayItem(payload){
    if(!payload?.distance_id) {
        return
    }
    let relay_item = {...relayItemTemplate}
    if(payload?.order_item_id) relay_item.order_item_id = payload?.order_item_id
    if(payload?.quantity) relay_item.quantity = payload?.quantity
    if(payload?.distance_id) relay_item.distance_id = payload?.distance_id
    if(payload?.key){
        relay_item.key = payload?.key
    } else {
        relay_item.key = `${relay_item.distance_id}`
    }

    const index = form.value.relay_items.findIndex(item => item.key === relay_item.key)
    
    if(index !== -1){
        form.value.relay_items[index] = relay_item
    } else {
        form.value.relay_items.push(relay_item)
    }
    console.log(form.value.relay_items)
}

function deleteRelayItem(key){
    form.value.relay_items = form.value.relay_items.filter(item => item.key !== key)
}

function changeRelayItemQuantity(key, quantity){
    let index = form.value.relay_items.findIndex(item => item.key === key)
    if(index === -1) return
    form.value.relay_items[index].quantity = quantity
}

const hasChange = computed(() => {
    const orderItems = new Set(
        orderData.value.order_items
            .filter(item => item.distance_type === 'relay')
            .map(item => `${item.distance_id}_${item.quantity}`)
    )

    const formItems = new Set(
        form.value.relay_items.map(item => `${item.distance_id}_${item.quantity}`)
    )

    // Разное количество элементов
    if (orderItems.size !== formItems.size) return true

    // Сравниваем каждый элемент
    return Array.from(orderItems).some(item => !formItems.has(item))
})

async function onSubmit(method = 'submit'){
    if (!hasChange.value) {
        emit('nextStep')
        return
    }
    
    loading.value = true
    await fetchAuth('/event/order/store-relay-items', {
        method: 'PUT',
        body: form.value
    }).then((response) => {
        setOrderData(response)
        toast({
            title: 'Эстефеты успешно сохранены',
            variant: 'success',
        })
        if(method === 'submit') emit('nextStep')
    }).catch((e) => {
        console.error(e)
    }).finally(() => {
        loading.value = false
    })
    console.log(form.value)
    //emit('nextStep')
}

watch(orderData, (value) => {
    setFormData(value)
}, {deep: true, immediate: true})


provide('relay_items', computed(() => form.value.relay_items))
provide('addRelayItem', addRelayItem)
provide('deleteRelayItem', deleteRelayItem)
provide('changeRelayItemQuantity', changeRelayItemQuantity)
</script>

<template>
    <div class="grid lg:grid-cols-4 gap-7 mt-10">
        <div class="col-span-3 grid gap-7">
            
            <div class="form_step">
                <FormRelayRacesSet
                    :items="postData.relays"
                    :price="postData.relay_price"
                />
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
<!--                <ExpiredBox
                        v-if="expiredTime"
                        :bottom_text="orderData?.already_paid
                            ? 'В противном случае изменения не будут сохранены'
                            : null
					    "
                        :time="expiredTime"
                        @time_end="setExpire"/>-->

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