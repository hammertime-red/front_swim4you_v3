<script setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '~/components/shadcn/ui/form'
import {
    RadioGroup,
    RadioGroupItem
} from '~/components/shadcn/ui/radio-group'
import { Label } from '~/components/shadcn/ui/label'
import { Checkbox } from '~/components/shadcn/ui/checkbox'
import { Button } from "~/components/shadcn/ui/button"
import GlobalErrorAlert from "~/components/forms/GlobalErrorAlert.vue";
import {useToast} from "~/components/shadcn/ui/toast";

const props = defineProps({
    orderId: {
        type: Number,
        required: true
    },
    amountToPay: {
        type: Number,
        required: true
    },
    postData: {
        type: Object,
        required: true
    },
    submitMode: {
        type: String,
    }
})

const emit = defineEmits(['send', 'refreshOrderData']);
const {toast} = useToast();
const loading = ref(false)

// Создаем схему валидации
const validationSchema = computed(() => {
    // Если режим оплаты - добавляем все правила валидации
    if (props.submitMode === 'pay') {
        return toTypedSchema(z.object({
            payment_method_id: z.number({
                required_error: 'Выберите метод оплаты',
            }),
            agreements: z.array(z.string()).refine(value => value.some(item => item), {
                message: 'Необходимо принять все условия',
            }),
        }))
    }

    // Иначе возвращаем пустую схему без валидации
    return toTypedSchema(z.object({}))
})

// Инициализируем форму
const form = useForm({
    validationSchema,
    initialValues: {
        // Задаем значения только если это режим оплаты
        ...(props.submitMode === 'pay' ? {
            payment_method_id: props.postData.payment_methods?.[0]?.id || null,
            agreements: []
        } : {})
    }
})

watch(form.errors, async (newErrors) => {
    if (Object.keys(newErrors).length > 0) {
        await nextTick()
        const firstError = document.querySelector('.form_error_message')
        if (firstError) {
            firstError.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }
    }
}, { deep: true })

// Обработчик отправки формы
const onSubmit = form.handleSubmit(async (values, context) => {
    loading.value = true
    setTimeout(() => loading.value = false, 2000)
    await fetchAuth('/event/order/confirm', {
        method: 'PUT',
        body: {
            order_id: props.orderId,
            payment_method_id: values.payment_method_id
        }
    }).then((response) => {
        if(response.payment_url){
            navigateTo(response.payment_url, {external: true})
            return
        }
        if(response.order_status){
            toast({
                title: 'Заявка успешно обновлена',
                variant: 'success'
            })
            navigateTo('profile')
        }
    }).catch((error) => {
        context.setErrors({global: error.data?.message, ...error.data.errors})
        console.log(form.errors.value)
    }).finally(() => {
        loading.value = false
    })
})
</script>

<template>
    <div class="content_box p-4 grid gap-6">
        <div v-if="amountToPay" class="">
            <p class="text-sub mb-1 text-sm">К оплате: </p>
            <p class="text_20 font-bold">{{ amountToPay }} ₽</p>
        </div>

        <form @submit="onSubmit" class="grid gap-6" id="payment_form">
            <!-- Методы оплаты -->
            <FormField
                    v-if="submitMode === 'pay'"
                    v-slot="{ componentField, value }"
                    type="radio"
                    name="payment_method_id">
                <FormItem class="space-y-3">
                    <FormLabel class="font-bold font-oswald text-sub uppercase">
                        Метод оплаты
                    </FormLabel>
                    <FormControl>
                        <RadioGroup v-bind="componentField">
                            <div class="flex flex-col gap-3">
                                <Label
                                        v-for="item in postData.payment_methods"
                                        :key="item.id"
                                        class="flex items-center space-x-2 px-3 py-4 border rounded-md"
                                        :class="{
                                        'bg-slate-100': value === item.id
                                    }"
                                >
                                    <RadioGroupItem :value="item.id" class="text-positive"/>
                                    <div class="grid gap-1">
                                        <p class="font-bold" :class="{
                                            'text-positive': value === item.id
                                        }">{{ item.display_name }}</p>
                                        <p v-if="item.display_description" class="text-slate-400">
                                            {{ item.display_description }}
                                        </p>
                                    </div>
                                </Label>
                            </div>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            </FormField>

            <!-- Чекбоксы согласия -->
            <FormField name="agreements">
                <FormItem>
                    <div class="grid gap-3">
                        <FormField
                                v-for="(item, index) in postData.accept_checkboxes"
                                :key="index"
                                v-slot="{ value, handleChange }"
                                name="agreements"
                                :value="`agree_${index}`"
                                type="checkbox"
                        >
                            <FormItem class="flex flex-row items-start space-x-3 space-y-0 ">
                                <FormControl>
                                    <Checkbox
                                            :checked="value.includes(`agree_${index}`)"
                                            @update:checked="handleChange"
                                    />
                                </FormControl>
                                <FormLabel class="font-normal pt-1">
                                    <div v-html="item.label" class="checkbox_label"></div>
                                </FormLabel>
                            </FormItem>
                        </FormField>
                    </div>
                    <FormMessage />
                </FormItem>
            </FormField>
            
            <GlobalErrorAlert v-if="form.errors.value?.global" :error="form.errors.value.global" class="form_error_message" />

            <Button
                    :disabled="loading"
                    type="submit"
                    variant="primary"
                    class="rounded-full"
                    size="lg"
            >
                <Icon v-if="loading" name="svg-spinners:ring-resize"/>
                <span v-else>{{submitMode === 'pay' ? 'Перейти к оплате' : 'Отправить'}}</span>
            </Button>
        </form>
    </div>
</template>