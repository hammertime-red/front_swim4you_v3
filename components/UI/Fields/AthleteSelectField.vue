<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/shadcn/ui/form";
import Autocomplete from "~/components/shadcn/custom/Autocomplete";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/shadcn/ui/select";
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
        default: 'Выберите значение'
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
        type: [String, Number],
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
    },
    mode: {
        type: String as PropType<'select' | 'autocomplete'>,
        required: true
    }
});

const emit = defineEmits(['search', 'select', 'clear', 'change'])

const validationSchema = props.required
    ? z.number({ required_error: 'Это поле обязательно'})
        .min(1, 'Это поле обязательно')
        .nullable()
    : z.number()
        .default(null)
        .nullable();

const { value: fieldValue, setValue } = useField(props.name, toTypedSchema(validationSchema))

watch(() => props.initialValue, (newValue) => {
    if (newValue) {
        setValue(newValue);
    }
}, { immediate: true });

const handleSelect = (value: any) => {
    if (props.mode === 'autocomplete') {
        setValue(value?.[props.optionValue] ?? null)
        emit('select', value)
    } else {
        emit('change', value);
        emit('select', props.options.find((option) => option[props.optionValue] === value));
    }
}

const handleClear = () => {
    setValue(null)
    emit('clear')
}
</script>

<template>
    <FormField v-slot="{ value, componentField }" :name="name">
        <FormItem :class="props.class">
            <FormLabel v-if="label">
                <span class="font-bold">{{ label }}</span>
                <span v-if="required" class="text-destructive">*</span>
            </FormLabel>
            <FormControl>
                <template v-if="mode === 'autocomplete'">
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
                </template>
                <template v-else>
                    <Select v-bind="componentField" :disabled="disabled" @update:modelValue="handleSelect">
                        <SelectTrigger class="max-w-full">
                            <SelectValue :placeholder="placeholder" />
                        </SelectTrigger>
                        <SelectContent>
                            <div v-if="!options?.length" class="text-sm text-center p-3">
                                Нет доступных вариантов
                            </div>
                            <template v-else>
                                <SelectItem
                                        v-for="option in options"
                                        :value="option[optionValue]"
                                        :key="option[optionValue]"
                                        :disabled="disabledCondition ? disabledCondition(option) : false"
                                        class="max-w-full"
                                >
                                    <p class="truncate">{{ option[optionLabel] }}</p>
                                    <p class="text-sm text-sub" v-if="getDescription && value !== option[optionValue]">
                                        {{ getDescription(option) }}
                                    </p>
                                </SelectItem>
                            </template>
                        </SelectContent>
                    </Select>
                </template>
            </FormControl>
            <FormMessage />
        </FormItem>
    </FormField>
</template>