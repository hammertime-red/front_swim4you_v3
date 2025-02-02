<template>
    <Sheet v-model:open="visibleModal">
        <SheetTrigger as-child>
            <slot/>
        </SheetTrigger>
        <SheetContent class="min-w-full md:min-w-[500px]">
            <SheetHeader class="mb-9">
                <p class="section_title_medium mb-2">{{ item.display_name }}</p>
                <div class="text-sub" v-html="item.description"></div>
            </SheetHeader>

<!--            <p class="font-bold mb-2">Выберите количество:</p>
            <div class="input-group input-group-num mb-3">
                <button
                        @click.prevent="minus"
                        :disabled="!hasExtraItem"
                        type="button"
                        :class="!hasExtraItem ? '' : 'text-body'"
                >-</button>
                <input
                        :value="hasExtraItem ? extraItem.quantity : 0"
                        type="number"
                        class="form-control"
                        min="0"
                        step="1"
                        onkeydown="return false"
                >
                <button
                        @click.prevent="plus"
                        type="button"
                        class="text-body"
                >+</button>
            </div>-->

                <NumberField v-model="quantity" class="mb-4">
                    <Label class="font-bold mb-2">Выберите количество</Label>
                    <NumberFieldContent>
                        <NumberFieldDecrement />
                        <NumberFieldInput  />
                        <NumberFieldIncrement />
                    </NumberFieldContent>
                </NumberField>
            

            <Button
                    @click.prevent="visibleModal = false"
                    variant="primary"
                    size="lg"
                    class="rounded-full w-full"
            >Сохранить</Button>
        </SheetContent>
    </Sheet>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "~/components/shadcn/ui/sheet"
import { Button } from "~/components/shadcn/ui/button"
import {
    NumberField, NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput
} from "~/components/shadcn/ui/number-field";
import {Label} from "~/components/shadcn/ui/label";

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

const visibleModal = ref(false)
const quantity = ref(0)

const extra_items = inject('extra_items', [])
const addExtraItem = inject('addExtraItem')
const deleteExtraItem = inject('deleteExtraItem')
const changeExtraItemQuantity = inject('changeExtraItemQuantity')

const extraItemKey = computed(() => `${props.item.id}`)

const extraItem = computed(() => {
    const found = extra_items.value.find(item => item.key === extraItemKey.value)
    return found ?? {
        order_extra_item_id: null,
        is_payed: false,
        extra_service_id: props.item.id,
        quantity: 0,
        athlete_id: null,
        distance_id: null,
        key: extraItemKey.value,
    }
})

const hasExtraItem = computed(() =>
    extra_items.value.some(item => item.key === extraItemKey.value)
)

watch(() => extraItem.value.quantity, (value) => {
    quantity.value = value
})

onMounted(() => {
    if(hasExtraItem.value){
        quantity.value = extraItem.value.quantity
    }
})

const plus = () => {
    if (!hasExtraItem.value) {
        addExtraItem(extraItem.value)
        return
    }
    changeExtraItemQuantity(extraItemKey.value, quantity.value)
}

const minus = () => {
    if (!hasExtraItem.value) return
    if (extraItem.value.quantity > 1) {
        changeExtraItemQuantity(extraItemKey.value, quantity.value)
        return
    }
    deleteExtraItem(extraItemKey.value)
}

watch(quantity, (value, oldValue) => {
    if(value > oldValue){
        plus()
    } else if(value < oldValue) {
        minus()
    }
})

</script>

<style>
</style>