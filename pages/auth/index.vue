<template>
    <div class="max-w-[330px]">
        <p class="section_title_medium mb-8">Добро пожаловать</p>
        <Form v-slot="{errors, meta}" @submit="onSubmit" :validation-schema="formSchema" class="w-full">
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
                v-model="password"
            >
                <div class="flex items-center justify-between mb-2">
                    <FormLabel class="font-bold block">Пароль <span class="text-red-500">*</span></FormLabel>
                    <NuxtLink
                        to="/auth/forgot-password"
                        class="text-primary-500 text-sm"
                    >
                        Забыли пароль?
                    </NuxtLink>
                </div>
                <FormControl>
                    <div class="relative mb-3 items-center">
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

            <FormGeneralError v-if="errors.general" :error="errors.general" />

            <Button :disabled="!meta.valid" type="submit" variant="default" size="lg" class="rounded-full w-full mt-4 py-4 h-auto">Войти</Button>
        </Form>
        <div class="auth_other mt-4 flex items-center justify-center">
            <span class="text-sub mr-3">Еще не зарегистрированы?</span>
            <NuxtLink :to="{name: 'registration'}" class="text-primary-500"
            >Регистрация</NuxtLink
            >
        </div>
    </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {Form, useForm} from "vee-validate";
import {FormControl, FormField, FormLabel, FormMessage} from "~/components/shadcn/ui/form/index";
import {Input} from "~/components/shadcn/ui/input/index";
import {Button} from "~/components/shadcn/ui/button/index";
import {toTypedSchema} from "@vee-validate/zod";
import * as z from 'zod'
import {Alert, AlertTitle} from "~/components/shadcn/ui/alert/index";
import FormGeneralError from "~/components/UI/FormGeneralError.vue";

definePageMeta({
    layout: 'auth',
    name: 'auth',
})

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()

const showPassword = ref(false)
const email = ref(null)
const password = ref(null)

const formSchema = toTypedSchema(z.object({
    email: z.string().min(1, 'Пожалуйста, введите email').max(255).email('Поле должно быть корретным email'),
    password: z.string().min(1, 'Пожалуйста, введите пароль').max(255),
}))

const onSubmit = (async (values, context) => {
    await userStore.login(values)
        .then((response) => navigateTo({ name: 'profile' }) )
        .catch((error) => {
            console.log(error)
            context.setErrors({general: error.data?.message, ...error.data.errors})
        })
})

async function emailVerify(){
    if(!email.value || !password.value) return
    await userStore.emailVerify(route.query.verify_url)
        .then((response) => navigateTo({ name: 'profile' }))
        .catch((error) => error_message.value = error.data.message)
}

onMounted(async () => {
    if(route.params.email){
        email.value = route.params.email
    }
    if (route.name === 'email_verify' && route.query.verify_url) {
        await emailVerify()
    }
})
</script>

<style>
.auth_logo {
    max-width: 170px;
}
</style>
