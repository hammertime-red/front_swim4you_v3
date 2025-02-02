<script setup lang="ts">
import { defineProps, watch } from 'vue'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/shadcn/ui/form'
import { Checkbox } from '~/components/shadcn/ui/checkbox'
import { useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { cn } from "~/lib/utils/shadcn";

const props = defineProps({
    class: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        required: true
    },
    required: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    initialValue: {
        type: Boolean,
        default: false
    },
    labelClass: {
        type: String,
    }
})

const emit = defineEmits(['change'])

const validationSchema = props.required
    ? z.boolean()
        .refine(val => val === true, {
            message: 'Это поле обязательно'
        })
        .default(false)
    : z.boolean()
        .default(false)

const { value: fieldValue, setValue } = useField(props.name, toTypedSchema(validationSchema))

watch(
    () => props.initialValue,
    newValue => {
        setValue(newValue)
    },
    { immediate: true }
)

watch(
    () => fieldValue.value,
    newValue => {
        emit('change', newValue)
    },
    { immediate: true }
)

const handleChange = (checked: boolean) => {
    setValue(checked)
}
</script>

<template>
    <FormField :name="name" v-slot="{ componentField }">
        <FormItem :class="cn(props.class, 'flex gap-2')">
            <FormControl>
                <Checkbox
                        v-bind="componentField"
                        :disabled="props.disabled"
                        :checked="fieldValue"
                        @update:checked="handleChange"
                />
            </FormControl>

            <FormLabel v-if="label" class="font-bold !mt-0" :class="labelClass">
                <span>{{ label }}</span>
                <span v-if="required" class="text-destructive">*</span>
            </FormLabel>

            <FormMessage />
        </FormItem>
    </FormField>
</template>