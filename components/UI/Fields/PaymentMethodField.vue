<script setup lang="ts">
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/shadcn/ui/form";
import {RadioGroup, RadioGroupItem} from "~/components/shadcn/ui/radio-group";
import {Label} from "~/components/shadcn/ui/label";
import {z} from "zod";
import {useField} from "vee-validate";
import {toTypedSchema} from "@vee-validate/zod";

const props = defineProps({
    class: {
        type: String,
    },
    name: {
        type: String,
        default: 'payment_method_id'
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
    }
});


const emit = defineEmits(['change', 'select'])

const validationSchema = props.required
    ? z.any().refine(
        (value) => props.options.some(item => item[props.optionValue] === value),
        { message: 'Выберите метод оплаты' }
    )
    : z.any().refine(
        (value) => value === null || props.options.some(item => item[props.optionValue] === value),
        { message: 'Неверное значение' }
    ).nullable();

const { setValue, value } = useField(props.name, toTypedSchema(validationSchema))

watch(() => props.initialValue, (newValue) => {
    if (newValue) {
        setValue(newValue);
    }
}, { immediate: true });

watch(value, (newValue) => {
    emit('change', newValue);
    emit('select', props.options.find((option) => option[props.optionValue] === newValue));
});

onMounted(() => {
    if(!props.initialValue){
        setValue(props.options[0][props.optionValue]);
    }
})
</script>

<template>
    <FormField
            v-slot="{ componentField }"
            :name="name"
            type="radio"
            >
        <FormItem class="space-y-3">
            <FormLabel v-if="label"><span class="font-bold">{{ label }}</span> <span v-if="required" class="text-destructive">*</span></FormLabel>
            <FormControl>
                <RadioGroup v-bind="componentField" :disabled="disabled">
                    <div class="flex flex-col gap-3">
                        <Label
                                v-for="option in options"
                                :key="option[optionValue]"
                                class="flex items-center space-x-2 px-3 py-4 border rounded-md"
                                :class="{
                                        'bg-slate-100': value === option[optionValue]
                                    }"
                        >
                            <RadioGroupItem :value="option[optionValue]" class="text-positive"/>
                            <div class="grid gap-1">
                                <p class="font-bold" :class="{
                                            'text-positive': value === option[optionValue]
                                        }">{{ option[optionLabel] }}</p>
                                <p v-if="option[optionDescription]" class="text-slate-400">
                                    {{ option[optionDescription] }}
                                </p>
                            </div>
                        </Label>
                    </div>
                </RadioGroup>
            </FormControl>
            <FormMessage/>
        </FormItem>
    </FormField>
</template>