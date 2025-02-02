<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/shadcn/ui/form";
import { Input } from "~/components/shadcn/ui/input";
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

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
        default: 'Выберите дату'
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
        type: String,
    },
    minDate: {
        type: String,
    },
    maxDate: {
        type: String,
    },
    labelClass: {
        type: String,
    }
})

const validationSchema = props.required
    ? z.string({
        required_error: 'Это поле обязательно',
        invalid_type_error: 'Некорректный тип данных'
    })
        .date({ message: 'Некорректная дата' })
        .min(1, 'Это поле обязательно')
        .refine((date) => {
            if (props.minDate && date < props.minDate) return false;
            if (props.maxDate && date > props.maxDate) return false;
            return true;
        }, { message: 'Дата вне допустимого диапазона' })
    : z.string({
        invalid_type_error: 'Некорректный тип данных'
    })
        .date({ message: 'Некорректная дата' })
        .optional() // Изменено здесь
        .nullable()
        .refine((date) => {
            if (!date) return true;
            if (props.minDate && date < props.minDate) return false;
            if (props.maxDate && date > props.maxDate) return false;
            return true;
        }, { message: 'Дата вне допустимого диапазона' });

const { value: fieldValue, setValue } = useField(props.name, toTypedSchema(validationSchema))

watch(() => props.initialValue, (newValue) => {
    if (newValue) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (dateRegex.test(newValue)) {
            setValue(newValue);
        } else {
            console.warn('Неверный формат даты. Используйте формат YYYY-MM-DD');
        }
    }
}, { immediate: true });
</script>

<template>
    <FormField v-slot="{ componentField }" :name="name">
        <FormItem :class="props.class">
            <FormLabel v-if="label" :class="labelClass">
                <span class="font-bold">{{ label }}</span>
                <span v-if="required" class="text-destructive">*</span>
            </FormLabel>
            <FormControl>
                <Input
                        type="date"
                        class="inline-block"
                        v-bind="componentField"
                        :placeholder="placeholder"
                        :disabled="props.disabled"
                        :min="minDate"
                        :max="maxDate"
                />
            </FormControl>
            <FormMessage />
        </FormItem>
    </FormField>
</template>