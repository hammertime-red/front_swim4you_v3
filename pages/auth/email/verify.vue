<template>
    <auth-layout>
        <div class="row gx-0 min-vh-full">
            <div class="auth_background col-lg-8 hidden lg:block"></div>
            <div class="auth_content col-lg-4 flex items-center justify-center">
                <div
                    class="auth_container flex flex-col items-center justify-center p-5 w-full">
                    <NuxtLink to="/">
                        <img class="auth_logo mb-3" :src="globalStore.global?.logo || '/assets/img/logo_n.png'" :alt="globalStore.global?.descriptor" />
                    </NuxtLink>
                    <p class="section_title_medium mb-4">Добро пожаловать</p>
                    <form @submit.prevent="login" class="auth_form w-full">
                        <label class="mb-3 block">
                            <span class="font-bold">Email <span class="text-red-500">*</span></span>
                            <input
                                v-model="email"
                                type="email"
                                class="form-control"
                                placeholder="example@gmail.com"
                                autocomplete="on"
                                required />
                        </label>

                        <label class="mb-3 block">
                            <div class="flex justify-between">
                                <span class="font-bold">Пароль <span class="text-red-500">*</span></span>
                                <NuxtLink
                                    to="/auth/forgot-password"
                                    class="text-decoration-none text-mute"
                                >Забыли пароль?</NuxtLink
                                >
                            </div>

                            <PasswordInput v-model="password" />
                        </label>

                        <button class="btn btn-primary btn-rounded w-full mb-3">Войти</button>

                        <div v-if="error_message" class="alert alert-danger text-red-500" role="alert">
                            {{ error_message }}
                        </div>
                    </form>
                    <div class="auth_other">
                        <span class="text-sub me-3">Еще не зарегистрированы?</span>
                        <NuxtLink to="/auth/registration" class="text-decoration-none"
                        >Регистрация</NuxtLink
                        >
                    </div>
                </div>
            </div>
        </div>
    </auth-layout>
</template>

<script setup>
import PasswordInput from '~/components/UI/PasswordInput.vue'
import AuthLayout from '~/layouts/auth.vue'
import {useGlobalStore} from "@/store/globalStore";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()
const globalStore = useGlobalStore()
const userStore = useUserStore()

const email = ref(null)
const password = ref(null)
const error_message = ref(null)

async function login(){
    if(!email.value || !password.value) return
    await userStore.login(email.value, password.value)
        .then((response) => router.push({ name: 'profile' }))
        .catch((error) => error_message.value = error.data.message)
}
async function emailVerify(){
    if(!email.value || !password.value) return
    await userStore.emailVerify(route.query.verify_url)
        .then((response) => router.push({ name: 'profile' }))
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
