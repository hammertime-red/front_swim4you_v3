<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/shadcn/ui/form";
import { Input } from "~/components/shadcn/ui/input";
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { ref, onMounted } from 'vue';

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
        default: '+7 (___) ___-__-__'
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
});

const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

const validationSchema = props.required
    ? z.string()
        .min(1, 'Это поле обязательно')
        .regex(phoneRegex, 'Введите корректный номер телефона')
        .default('')
    : z.string()
        .regex(phoneRegex, 'Введите корректный номер телефона')
        .default('')
        .nullable();

const { value: fieldValue, setValue } = useField(props.name, toTypedSchema(validationSchema));

const formatPhoneNumber = (input: string): string => {
    // Удаляем все нецифровые символы
    const digits = input.replace(/\D/g, '');

    // Строим форматированный номер
    let formatted = '';
    if (digits.length === 0) return formatted;

    formatted = '+7';
    if (digits.length > 1) {
        formatted += ` (${digits.slice(1, 4)}`;
    }
    if (digits.length > 4) {
        formatted += `) ${digits.slice(4, 7)}`;
    }
    if (digits.length > 7) {
        formatted += `-${digits.slice(7, 9)}`;
    }
    if (digits.length > 9) {
        formatted += `-${digits.slice(9, 11)}`;
    }

    return formatted;
};

const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    let value = target.value;

    // Если первый символ не +7, добавляем его
    if (!value.startsWith('+7')) {
        value = '+7' + value.replace(/^\+7/, '');
    }

    // Форматируем номер
    const formattedValue = formatPhoneNumber(value);

    // Обновляем значение
    setValue(formattedValue);

    // Устанавливаем курсор в конец строки
    nextTick(() => {
        const input = target;
        const pos = formattedValue.length;
        input.setSelectionRange(pos, pos);
    });
};

// Обработка начального значения
watch(() => props.initialValue, (newValue) => {
    if (newValue) {
        setValue(formatPhoneNumber(newValue));
    }
}, { immediate: true });
</script>

<template>
    <FormField v-slot="{ componentField }" :name="name">
        <FormItem :class="props.class">
            <FormLabel v-if="label">
                <span class="font-bold">{{ label }}</span>
                <span v-if="required" class="text-destructive">*</span>
            </FormLabel>
            <FormControl>
                <Input
                        v-bind="componentField"
                        :placeholder="placeholder"
                        :disabled="props.disabled"
                        :value="fieldValue"
                        @input="handleInput"
                        type="tel"
                        inputmode="numeric"
                        maxlength="18"
                />
            </FormControl>
            <FormMessage />
        </FormItem>
    </FormField>
</template>