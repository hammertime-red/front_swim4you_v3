<!-- PriceFilter.vue -->
<script setup>
import { Slider } from '@/components/shadcn/ui/slider'
import { Input } from '@/components/shadcn/ui/input'

const props = defineProps({
    minLimit: {
        type: Number,
        default: 0
    },
    maxLimit: {
        type: Number,
        default: 100000
    },
    title: {
        type: String,
        default: 'Цена'
    }
})

const min = defineModel('min')
const max = defineModel('max')

const range = ref([min.value || props.minLimit, max.value || props.maxLimit])

watch(range, (newRange) => {
    min.value = newRange[0]
    max.value = newRange[1]
}, { deep: true })

watch([min, max], ([newMin, newMax]) => {
    range.value = [newMin, newMax]
})

onMounted(() => {
    min.value = props.minLimit
    max.value = props.maxLimit
    range.value = [props.minLimit, props.maxLimit]
})
</script>

<template>
    <div class="space-y-4">
        <p v-if="title" class="font-oswald uppercase font-bold text-sub">
            {{ title }}
        </p>
        <Slider
                v-model="range"
                :min="minLimit"
                :max="maxLimit"
                :step="maxLimit > 1000 ? 100 : 10"
                class="w-full"
        />
        <div class="flex items-center justify-between gap-4">
            <div class="relative text-sm">
                <Input
                        type="number"
                        v-model="min"
                        :min="minLimit"
                        :max="max"
                        class="w-24"
                />
                <span class="absolute top-1/2 -translate-y-1/2 right-2 text-sub mt-0.5">₽</span>
            </div>
            
            <span class="text-muted-foreground">—</span>
            
            <div class="relative text-sm">
                <Input
                        type="number"
                        v-model="max"
                        :min="min"
                        :max="maxLimit"
                        class="w-24"
                />
                <span class="absolute top-1/2 -translate-y-1/2 right-2 text-sub mt-0.5">₽</span>
            </div>
        </div>
    </div>
</template>