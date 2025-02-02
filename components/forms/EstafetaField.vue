<template>
    <div class="extended_check"
         :class="{
            'bg-slate-100': hasRelayItem
         }">
        <div class="grid md:flex gap-7 justify-between items-center">
            <p class="font-bold text-lg md:text-xl">{{ item.full_name }}</p>

            <div class="">
                <NumberField v-if="hasRelayItem" v-model="quantity" :min="0" :max="item.places_limit">
                    <Label>Кол-во участников</Label>
                    <NumberFieldContent>
                        <NumberFieldDecrement />
                        <NumberFieldInput />
                        <NumberFieldIncrement />
                    </NumberFieldContent>
                </NumberField>
            
                <Button v-else @click.prevent="quantity++" variant="primary" size="lg" class="rounded-full">
                    Добавить
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Label } from '~/components/shadcn/ui/label'
import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
} from '~/components/shadcn/ui/number-field'
import {Button} from '~/components/shadcn/ui/button'

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

const relay_items = inject('relay_items', [])
const addRelayItem = inject('addRelayItem')
const deleteRelayItem = inject('deleteRelayItem')
const changeRelayItemQuantity = inject('changeRelayItemQuantity')

const quantity = ref(0)

watch(quantity, (value, oldValue) => {
    if(value > oldValue){
        plus()
    } else if(value < oldValue) {
        minus()
    }
})

const relayItemKey = computed(() => `relay__${props.item.id}`)

const relayItem = computed(() => {
    const found = relay_items.value.find(item => item.key === relayItemKey.value)
    return found ?? {
        order_item_id: null,
        key: relayItemKey.value,
        distance_id: props.item.id,
        quantity: 1
    }
})

const hasRelayItem = computed(() => {
    return relay_items.value.some(item => item.key === relayItemKey.value)
})

if(hasRelayItem.value){
    quantity.value = relayItem.value.quantity
}
/*watch(() => relayItem, (value) => {
    console.log(value)
    //quantity.value = value.quantity
}, { deep: true, immediate: true })*/


const isMaxQuantity = computed(() =>
    relayItem.value.quantity >= props.item.places_limit
)

const plus = () => {
    if (!hasRelayItem.value) {
        addRelayItem(relayItem.value)
        return
    }
    if (isMaxQuantity.value) return
    changeRelayItemQuantity(relayItemKey.value, quantity.value)
}

const minus = () => {
    if (!hasRelayItem.value) return
    if (relayItem.value.quantity > 1) {
        changeRelayItemQuantity(relayItemKey.value, quantity.value)
        return
    }
    deleteRelayItem(relayItemKey.value)
}
</script>