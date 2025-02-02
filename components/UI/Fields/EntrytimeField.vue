<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/shadcn/ui/form";
import { Input } from "~/components/shadcn/ui/input";
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { watch, nextTick } from 'vue';

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
        default: '__:__.__'
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

const timeRegex = /^[0-5][0-9]:[0-5][0-9]\.[0-9]{2}$/;

const validationSchema = props.required
    ? z.string()
        .min(1, 'Это поле обязательно')
        .regex(timeRegex, 'Введите корректное время в формате мм:сс.мс')
        .default('')
    : z.string()
        .regex(timeRegex, 'Введите корректное время в формате мм:сс.мс')
        .default('')
        .nullable();

const { value: fieldValue, setValue } = useField(props.name, toTypedSchema(validationSchema));

const formatTime = (input: string): string => {
    // Удаляем все нецифровые символы
    const digits = input.replace(/\D/g, '');

    // Строим форматированное время
    let formatted = '';
    if (digits.length === 0) return formatted;

    // Минуты
    if (digits.length >= 1) {
        formatted += digits[0];
        if (digits.length >= 2) {
            formatted += digits[1];
        }
    }

    // Добавляем двоеточие после минут
    if (digits.length >= 2) {
        formatted += ':';
    }

    // Секунды
    if (digits.length >= 3) {
        formatted += digits[2];
        if (digits.length >= 4) {
            formatted += digits[3];
        }
    }

    // Добавляем точку после секунд
    if (digits.length >= 4) {
        formatted += '.';
    }

    // Сотые доли
    if (digits.length >= 5) {
        formatted += digits[4];
        if (digits.length >= 6) {
            formatted += digits[5];
        }
    }

    return formatted;
};

const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    let value = target.value;

    // Форматируем время
    const formattedValue = formatTime(value);

    // Обновляем значение
    setValue(formattedValue);

    // Устанавливаем курсор в конец строки
    nextTick(() => {
        const input = target;
        const pos = formattedValue.length;
        input.setSelectionRange(pos, pos);
    });
};

// Валидация при вводе
const validateTimeInput = (value: string) => {
    const minutes = parseInt(value.substring(0, 2));
    const seconds = parseInt(value.substring(3, 5));

    if (minutes > 59) return false;
    if (seconds > 59) return false;

    return true;
};

// Обработка начального значения
watch(() => props.initialValue, (newValue) => {
    if (newValue) {
        setValue(formatTime(newValue));
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
                        type="text"
                        inputmode="numeric"
                        maxlength="8"
                />
            </FormControl>
            <FormMessage />
        </FormItem>
    </FormField>
</template>