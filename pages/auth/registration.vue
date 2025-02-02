<template>
    <div class="max-w-[330px]">
        <p class="section_title_medium text-center mb-2">Зарегистрируйтесь</p>
        <p class="text-sub text-center mb-8">Для участия в мероприятиях</p>
        <Form v-slot="{errors, meta}" @submit="onSubmit" :validation-schema="formSchema" class="w-full">
            <FormField
                as="div"
                class="mb-4"
                v-slot="{ componentField }"
                name="name"
            >
                <FormLabel class="font-bold block mb-2">Ваше ФИО <span class="text-red-500">*</span></FormLabel>
                <FormControl>
                    <Input
                        v-bind="componentField"
                        placeholder="Иван Иванов"
                    />
                    <FormMessage />
                </FormControl>
            </FormField>

            <FormField
                as="div"
                class="mb-4"
                v-slot="{ componentField }"
                name="email"
                v-model="email"
            >
                <FormLabel class="font-bold block mb-2">Email <span class="text-red-500">*</span></FormLabel>
                <FormControl>
                    <Input
                        v-bind="componentField"
                        type="email"
                        placeholder="example@gmail.com"
                        autocomplete="on"
                    />
                    <FormMessage />
                </FormControl>
            </FormField>

            <FormField
                v-slot="{ componentField }"
                name="password"
            >
                <FormLabel class="font-bold block">Пароль <span class="text-red-500">*</span></FormLabel>
                <FormControl>
                    <div class="relative mb-5 items-center">
                        <Input
                            v-bind="componentField"
                            :type="showPassword ? 'text' : 'password'"
                            placeholder="Введите пароль"
                            autocomplete="on"
                        />
                        <Button @click.prevent.stop="showPassword = !showPassword" variant="ghost" class="border-l border-slate-200 hover:bg-primary-50 absolute end-0 h-full inset-y-0 flex items-center justify-center px-4">
                            <Icon v-if="showPassword" name="ri:eye-off-line" size="18" />
                            <Icon v-else name="ri:eye-line" size="18" />
                        </Button>
                    </div>

                    <FormMessage />
                </FormControl>
            </FormField>

            <FormField v-if="globalStore.PAGE_PRIVACY_POLICY" v-slot="{ value, handleChange }" type="checkbox" name="accept_checks">
                <FormItem class="flex flex-row items-start gap-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                        <Checkbox :checked="value" @update:checked="handleChange" />
                    </FormControl>
                    <div class="space-y-1 leading-none">
                        <FormDescription>
                            Ознакомлен и согласен с <NuxtLink :to="`/page/${globalStore.PAGE_PRIVACY_POLICY}`" class="text-primary-500">политикой конфиденциальности</NuxtLink>
                        </FormDescription>
                        <FormMessage />
                    </div>
                </FormItem>
            </FormField>

            <FormGeneralError v-if="errors.global" :errors="errors.global" />

            <Button :disabled="!meta.valid || loading" type="submit" variant="default" size="lg" class="rounded-full w-full mt-4 py-4 h-auto">
                <span>Зарегистрироваться</span>
            </Button>
        </Form>

        <div class="auth_other mt-4 flex items-center justify-center">
            <span class="text-sub mr-3">Уже есть аккаунт?</span>
            <NuxtLink :to="{name: 'auth'}" class="text-primary-500">Войти</NuxtLink>
        </div>
    </div>
</template>

<script setup>
import PasswordInput from '~/components/UI/PasswordInput.vue'
import {ref} from "vue";
import {useGlobalStore} from "@/store/globalStore";
import {useRouter} from "vue-router";
import {Form} from "vee-validate";
import {toTypedSchema} from "@vee-validate/zod";
import * as z from "zod";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "~/components/shadcn/ui/form/index";
import {Input} from "~/components/shadcn/ui/input/index";
import {Button} from "~/components/shadcn/ui/button/index";
import {Checkbox} from "~/components/shadcn/ui/checkbox/index";
import FormGeneralError from "~/components/UI/FormGeneralError.vue";

definePageMeta({
    layout: 'auth',
    name: 'registration',
})

const globalStore = useGlobalStore()
const userStore = useUserStore()
const router = useRouter()

const showPassword = ref(false)
const loading = ref(false)

const formSchema = toTypedSchema(z.object({
    name: z.string().min(1, 'Пожалуйста, введите ФИО').max(255).default(''),
    email: z.string().min(1, 'Пожалуйста, введите email').max(255).email('Поле должно быть корретным email').default(''),
    password: z.string().min(1, 'Пожалуйста, введите пароль').max(255).default(''),
    accept_checks: z.boolean().refine(val => !globalStore.PAGE_PRIVACY_POLICY || val === true, { message: "Вы должны принять условия." }).default(false),
}))

async function onSubmit(values, context){
    const credentials = {
        name: values.name,
        email: values.email,
        password: values.password
    }
    loading.value = true
    await userStore.register(credentials)
        .then((response) => router.push({ name: 'profile' }))
        .catch((error) => context.setErrors({global: error.data?.message, ...error.data.errors}))
        .finally(() => loading.value = false)
}
</script>

<style>
</style>
