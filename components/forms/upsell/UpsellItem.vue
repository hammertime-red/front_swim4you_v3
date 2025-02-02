<template>
    <template v-if="isAllowed">
        <div class="extended_check mb-3" :class="{ active: hasExtraItems }">
            <div class="flex gap-7 justify-between items-center">
                <div class="col">
                    <div class="form-check">
                        <div class="form-check-label ps-3">
                            <a v-if="item.display_name"
                               @click.prevent="modalVisible = true"
                               href="#"
                               class="d-block font-bold text_20 mb-2"
                               :class="{ 'text-positive': hasExtraItems }">
                                {{ item.display_name }}
                            </a>

                            <p v-if="item.short_description" class="mb-2">
                                {{ item.short_description }}
                            </p>

                            <p v-if="hasExtraItems" class="text-positive font-bold mb-0">
                                {{ itemQuantityText }} x {{ item.price }} ₽
                            </p>
                        </div>
                    </div>
                </div>

                <div class="col-md-3">
                    <p class="text-center mb-1">
                        <span class="font-bold">{{ item.price }} ₽</span>
                        <span class="text-sub">/ {{ item.measure || 'услуга' }}</span>
                    </p>

                    <component :is="modalComponent"
                        v-if="modalComponent"
                       :item="item">
                        <Button :variant="hasExtraItems ? 'accent' : 'primary'" size="lg" class="rounded-full">
                            {{ hasExtraItems ? 'Изменить' : 'Добавить' }}
                        </Button>
                    </component>
                </div>
            </div>
        </div>

    </template>
</template>

<script setup>
import UpsellDefaultModal from '../../offcanvases/UpsellDefaultModal.vue'
import UpsellForAthletesModal from '../../offcanvases/UpsellForAthletesModal.vue'
import UpsellForDistancesModal from '../../offcanvases/UpsellForDistancesModal.vue'
import { Button} from "~/components/shadcn/ui/button";

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

const modalVisible = ref(false)
const orderData = inject('orderData')
const extra_items = inject('extra_items', [])

const serviceExtraItems = computed(() =>
    extra_items.value.filter(item => item.extra_service_id === props.item.id)
)

const hasExtraItems = computed(() => serviceExtraItems.value.length > 0)

const itemQuantityText = computed(() =>
    props.item.type === 'default' ? serviceExtraItems.value[0].quantity : serviceExtraItems.value.length
)

const modalComponent = computed(() => {
    const modalMap = {
        'for_distances': UpsellForDistancesModal,
        'for_athletes': UpsellForAthletesModal,
        'default': UpsellDefaultModal
    }
    return modalMap[props.item.type]
})

const isAllowed = computed(() => {
    if (props.item.type !== 'for_distances') return true
    if (!props.item?.for_distances?.length) return true

    return orderData.value.order_items.filter(item => item.distance_type === 'distance')
        .filter(item => item.is_payed || item.reservation_status === 'reserved')
        .some(item => props.item.for_distances.includes(item.distance_length.toString()))
})
</script>