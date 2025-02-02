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

        <p class="font-bold mb-2">Отметьте спортсменов, для которых нужно получить услугу:</p>
        <div class="athletes_checkboxes mb-5">
            <UpsellAthlete v-for="athlete_id in athletes" :key="athlete_id" :extra_service_id="item.id" :athlete_id="athlete_id"/>
        </div>
        <Button @click.prevent="visibleModal = false" variant="primary" size="lg" class="rounded-full w-full">Сохранить</Button>
    </SheetContent>
</Sheet>

</template>

<script setup>
import UpsellAthlete from '../forms/upsell/UpsellAthlete.vue'
import {Sheet, SheetContent, SheetHeader, SheetTrigger} from "~/components/shadcn/ui/sheet";
import {Button} from "~/components/shadcn/ui/button";

const props = defineProps({
    item: {
        type: Object,
        required: true
    },
})
const visibleModal = ref(false)
const orderData = inject('orderData')

const currentOrderItems = computed(() => {
    return orderData.order_items.filter(item => item.distance_type === 'distance').filter(
        (item) => item.is_payed || item.reservation_status == 'reserved'
    )
})

const athletes = computed(() => {
    return [...new Set(currentOrderItems.value.map(item => item.athlete_id))]
})
</script>
