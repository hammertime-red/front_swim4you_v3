<script setup lang="ts">
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/shadcn/ui/form";
import Autocomplete from "~/components/shadcn/custom/Autocomplete";
import {useField} from "vee-validate";
import {toTypedSchema} from "@vee-validate/zod";
import {z} from "zod";
import {ref, watch} from 'vue'

const props = defineProps({
    class: {
        type: String,
    },
    label: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    placeholder: {
        type: String,
        default: 'Выберите значение'
    },
    required: {
        type: Boolean,
        default: true
    },
    disabled: {
        type: Boolean,
        default: false
    },
    initialValue: {
        type: String,
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
    disabledCondition: {
        type: Function as PropType<(option: Record<string, any>) => boolean>,
        default: null
    },
    getDescription: {
        type: Function as PropType<(option: Record<string, any>) => boolean>,
        default: null
    }
})
const emit = defineEmits(['search', 'select', 'clear'])

const validationSchema = props.required
    ? z.number({ required_error: 'Это поле обязательно'})
        .min(1, 'Это поле обязательно')
        .nullable()
    : z.number()
        .default(null)
        .nullable();

const {value: fieldValue, setValue} = useField(props.name, toTypedSchema(validationSchema))

watch(() => props.initialValue, (newValue) => {
    if (newValue) {
        setValue(newValue);
    }
}, { immediate: true });

const handleSelect = (value: any) => {
    setValue(value?.[props.optionValue] ?? null)
    emit('select', value)
}

const handleClear = () => {
    setValue(null)
    emit('clear')
}
</script>

<template>
    <FormField v-slot="{ value }" :name="name">
        <FormItem :class="props.class">
            <FormLabel v-if="label">
                <span class="font-bold">{{ label }}</span>
                <span v-if="required" class="text-destructive">*</span>
            </FormLabel>
            <FormControl>
                <Autocomplete
                        v-model="fieldValue"
                        :placeholder="placeholder"
                        :disabled="disabled"
                        :options="options"
                        :option-label="optionLabel"
                        :option-value="optionValue"
                        :disabled-condition="disabledCondition"
                        :get-description="getDescription"
                        @search="(query) => emit('search', query)"
                        @select="handleSelect"
                        @clear="handleClear"
                />
            </FormControl>
            <FormMessage />
        </FormItem>
    </FormField>
</template>