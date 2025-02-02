<script setup lang="ts">
import {
    ComboboxRoot,
    ComboboxInput,
    ComboboxAnchor,
    ComboboxTrigger,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxViewport,
    ComboboxPortal,
    ComboboxArrow
} from 'radix-vue'

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: null
    },
    options: {
        type: Array as PropType<Record<string, any>[]>,
        default: () => []
    },
    optionLabel: {
        type: String,
        default: 'name'
    },
    optionValue: {
        type: String,
        default: 'id'
    },
    placeholder: {
        type: String,
        default: 'Поиск...'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    },
    disabledCondition: {
        type: Function as PropType<(option: Record<string, any>) => boolean>,
        default: null
    },
    getDescription: {
        type: Function as PropType<(option: Record<string, any>) => boolean>,
        default: null
    }
})

const modelValue = defineModel()
const emit = defineEmits(['search', 'select', 'clear'])

const query = ref('')
const searchInit = ref(false)
const searchTimeout = ref<NodeJS.Timeout | null>(null)

const selectedItem = computed(() => {
   return props.options.find(item => item[props.optionValue] === props.modelValue)
})

const selectedItemValue = computed(() => {
    return selectedItem.value ? selectedItem.value[props.optionLabel] : ''
})

const handleSearch = async (event: Event) => {
    const newQuery = (event.target as HTMLInputElement).value
    query.value = newQuery.trim()

    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
    }

    if (query.value.length < 3) {
        emit('search', '')
        return
    }
    searchTimeout.value = setTimeout(() => {
        emit('search', newQuery)
    }, 500)
    searchInit.value = true
}

watch(selectedItem, (value) => {
    if(value) {
        emit('select', value)
    } else {
        emit('clear', value)
    }
})

onBeforeUnmount(() => {
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
    }
})
</script>

<template>
    <ComboboxRoot
            v-model="modelValue"
            :disabled="disabled"
            :display-value="() => selectedItemValue"
            class="flex w-full flex-col rounded-md bg-popover text-popover-foreground relative">

        <ComboboxAnchor class="w-full items-center justify-between gap-[5px] flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sub-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <ComboboxInput
                    class="!bg-transparent outline-none h-full selection:bg-primary-50 placeholder-sub w-full"
                    :placeholder="placeholder"
                    @input="handleSearch"
            />
            <ComboboxTrigger v-if="options.length" class="h-full flex items-center">
                <Icon name="ri:arrow-down-s-line" class="h-4 w-4 text-sub" />
            </ComboboxTrigger>
        </ComboboxAnchor>

        <ComboboxPortal>
            <ComboboxContent
                    position="popper"
                    side="bottom"
                    :style="{ width: 'var(--radix-combobox-trigger-width)' }"
                    class="z-50 bg-white overflow-hidden rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.15),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.1)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
            >
                <ComboboxViewport class="p-1">
                    <ComboboxEmpty v-if="searchInit" class="py-3 text-center text-sm">
                        <span v-if="loading">Загрузка...</span>
                        <span v-else>Нет подходящий вариантов</span>
                    </ComboboxEmpty>

                    <ComboboxItem
                            v-for="(option, index) in options"
                            :key="index"
                            class="relative leading-none cursor-pointer rounded-sm text-sm flex items-center pr-[35px] pl-[25px] py-3 select-none data-[disabled]:text-sub data-[disabled]:pointer-events-none data-[disabled]:cursor-default data-[highlighted]:outline-none data-[highlighted]:bg-slate-100"
                            :value="option[optionValue]"
                            :disabled="disabledCondition ? disabledCondition(option) : false"
                    >
                        <ComboboxItemIndicator class="absolute left-0 w-[25px] inline-flex items-center justify-center">
                            <Icon name="ri:check-line" />
                        </ComboboxItemIndicator>

                        <div class="">
                            <p>{{ option[optionLabel] }}</p>
                            <p v-if="getDescription" class="text-xs text-sub">{{ getDescription(option) }}</p>
                        </div>
                    </ComboboxItem>

                </ComboboxViewport>
                <ComboboxArrow />
            </ComboboxContent>
        </ComboboxPortal>
    </ComboboxRoot>
</template>