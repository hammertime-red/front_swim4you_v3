<script setup lang="ts">
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "~/components/shadcn/ui/select";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/shadcn/ui/form";
import {useField} from "vee-validate";
import {z} from "zod";
import {toTypedSchema} from "@vee-validate/zod";

const props = defineProps({
    class: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    label: {
        type: String,
    },
    placeholder: {
        type: String,
        default: 'Выберите вариант'
    },
    required: {
        type: Boolean,
        default: false
    },
    options: {
        type: Array as PropType<any[]>,
        required: true
    },
    optionLabel: {
        type: String,
        default: 'label'
    },
    optionValue: {
        type: String,
        default: 'value'
    },
    optionDescription: {
        type: String,
        default: null
    },
    initialValue: {
        type: [String, Number],
    },
    disabledCondition: {
        type: Function as PropType<(option: Record<string, any>) => boolean>,
        default: null
    },
    getDescription: {
        type: Function as PropType<(option: Record<string, any>) => boolean>,
        default: null
    },
    disabled: {
        type: Boolean,
        default: false
    },
    nullable: {
        type: Boolean,
        default: false
    },
    labelClass: {
        type: String,
    }
});

const emit = defineEmits(['change', 'select'])

const validationSchema = props.required
    ? z.any().refine(
        (value) => props.options.some(item => item[props.optionValue] === value),
        { message: 'Это поле обязательно' }
    )
    : z.any().refine(
        (value) => value === null || props.options.some(item => item[props.optionValue] === value),
        { message: 'Неверное значение' }
    ).nullable();

const { setValue, value } = useField(props.name, toTypedSchema(validationSchema))

watch(() => props.initialValue, (newValue) => {
    if (newValue || newValue === null) {
        setValue(newValue);
    }
}, { immediate: true });

watch(value, (newValue) => {
    emit('change', newValue);
    emit('select', props.options.find((option) => option[props.optionValue] === newValue));
});

</script>

<template>
    <FormField v-slot="{ value, componentField }" :name="name" >
        <FormItem :class="props.class" class="max-w-full">
            <FormLabel v-if="label" :class="labelClass"><span class="font-bold">{{ label }}</span> <span v-if="required" class="text-destructive">*</span></FormLabel>
            <Select v-bind="componentField" :disabled="disabled">
                <FormControl>
                    <SelectTrigger class="max-w-full">
                        <SelectValue :placeholder="nullable ? '' : placeholder" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <div v-if="!options?.length" class="text-sm text-center p-3">Нет доступных вариантов</div>
                    <template v-else>
                        <SelectItem
                                v-if="nullable"
                                :value="null"
                                class="max-w-full"
                        >
                            <p class="truncate">{{ placeholder }}</p>
                        </SelectItem>
                        <SelectItem
                                v-for="option in options"
                                :value="option[optionValue]"
                                :key="option[optionValue]"
                                :disabled="disabledCondition ? disabledCondition(option) : false"
                                class="max-w-full"
                        >
                            <p class="truncate">{{ option[optionLabel] }}</p>
                            <p class="text-sm text-sub" v-if="getDescription && value !== option[optionValue]">{{ getDescription(option) }}</p>
                        </SelectItem>
                    </template>
                </SelectContent>
            </Select>
            <FormMessage />
        </FormItem>
    </FormField>
</template>