<script setup lang="ts">
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/shadcn/ui/form";
import {Input} from "~/components/shadcn/ui/input";
import {useField} from "vee-validate";
import {toTypedSchema} from "@vee-validate/zod";
import {z} from "zod";

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
        default: 'example@example.ru'
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
    }
})

const validationSchema = props.required
    ? z.string()
        .min(1, 'Это поле обязательно')
        .max(255, 'Поле слишком длинное')
        .email('Поле должно быть корректным email')
        .default('')
    : z.string()
        .max(255, 'Поле слишком длинное')
        .email('Поле должно быть корректным email')
        .default('')
        .nullable();

const {value: fieldValue, setValue} = useField(props.name, toTypedSchema(validationSchema))

watch(() => props.initialValue, (newValue) => {
    if (newValue) {
        setValue(newValue);
    }
}, { immediate: true });
</script>

<template>
    <FormField v-slot="{ componentField, value }" :name="name">
        <FormItem :class="props.class">
            <FormLabel v-if="label"><span class="font-bold">{{ label }}</span> <span v-if="required" class="text-destructive">*</span></FormLabel>
            <FormControl>
                <Input
                    v-bind="componentField"
                    :placeholder="placeholder"
                    :disabled="props.disabled"
                />
            </FormControl>
            <FormMessage />
        </FormItem>
    </FormField>
</template>