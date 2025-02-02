<script setup lang="ts">
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/shadcn/ui/form";
import {Checkbox} from "~/components/shadcn/ui/checkbox";
import {z} from "zod";
import {useField} from "vee-validate";
import {toTypedSchema} from "@vee-validate/zod";

const props = defineProps({
    name: {
        type: String,
        default: 'agreements'
    },
    options: {
        type: Array as PropType<any[]>,
        required: true
    },
    optionLabel: {
        type: String,
        default: 'label'
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

const validationSchema = z.array(z.string(), {
    required_error: 'Необходимо принять все условия',
    invalid_type_error: 'Необходимо принять все условия',
}).min(1, 'Необходимо принять все условия');

const { value, setValue } = useField(props.name, toTypedSchema(validationSchema));

const handleCheckboxChange = (checked: boolean, index: number) => {
    const currentValue = value.value || [];
    if (checked) {
        setValue([...currentValue, `agree_${index}`]);
    } else {
        setValue(currentValue.filter(item => item !== `agree_${index}`));
    }
};

</script>

<template>
    <div>
        <FormField :name="name" v-slot="{ error }">
            <FormItem>
                <div class="grid gap-3">
                    <div
                            v-for="(item, index) in options"
                            :key="index"
                            class="flex flex-row items-start space-x-3 space-y-0"
                    >
                        <FormControl>
                            <Checkbox
                                    :checked="(value || []).includes(`agree_${index}`)"
                                    @update:checked="(checked) => handleCheckboxChange(checked, index)"
                            />
                        </FormControl>
                        <FormLabel class="font-normal pt-1">
                            <div v-html="item[props.optionLabel]" class="checkbox_label"></div>
                        </FormLabel>
                    </div>
                </div>
                <FormMessage />
            </FormItem>
        </FormField>
    </div>
</template>