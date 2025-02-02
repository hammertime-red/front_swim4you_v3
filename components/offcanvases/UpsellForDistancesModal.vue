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

            <p class="font-bold mb-2">
                Отметьте спортсменов и дистанции, для которых нужно получить услугу:
            </p>

            <div class="athletes_checkboxes mb-5">
                <UpsellAthleteAccordeon
                        v-for="athlete in athleteGroups"
                        :key="athlete.athlete_id"
                        :extra_service_id="item.id"
                        :athlete_id="athlete.athlete_id"
                        :distances="athlete.distances"
                />
            </div>

            <Button @click.prevent="visibleModal = false" variant="primary" size="lg" class="rounded-full w-full">Сохранить</Button>
        </SheetContent>
    </Sheet>
</template>

<script setup>
import { computed } from 'vue'
import UpsellAthleteAccordeon from '../forms/upsell/UpsellAthleteAccordeon.vue'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "~/components/shadcn/ui/sheet"
import {Button} from "~/components/shadcn/ui/button";

const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    }
})

const orderData = inject('orderData')

const visibleModal = ref(false)

const currentOrderItems = computed(() => {
    const distanceItems = orderData.order_items.filter(item => item.distance_type === 'distance')
    return distanceItems.filter(item =>
        (item.is_payed || item.reservation_status === 'reserved') &&
        (!props.item.for_distances?.length ||
            props.item.for_distances.includes(item.distance_length.toString()))
    )
})

const athleteGroups = computed(() => {
    return currentOrderItems.value.reduce((acc, item) => {
        let group = acc.find(g => g.athlete_id === item.athlete_id)

        if (!group) {
            group = {
                athlete_id: item.athlete_id,
                distances: []
            }
            acc.push(group)
        }

        if (!group.distances.includes(item.distance_id)) {
            group.distances.push(item.distance_id)
        }

        return acc
    }, [])
})
</script>