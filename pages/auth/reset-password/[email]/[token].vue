<template>
    <auth-layout>
        <div class="row gx-0 min-vh-full">
            <div class="auth_background col-lg-8 hidden lg:block"></div>
            <div class="auth_content col-lg-4 flex items-center justify-center">
                <div class="auth_container flex flex-col items-center justify-center p-5 w-full">
                    <NuxtLink to="/">
                        <img class="auth_logo mb-3" src="/img/logo.png" alt="Академия Спорта" />
                    </NuxtLink>
                    <p class="section_title_medium mb-2 text-center">Восстановить пароль</p>
                    <p class="text-sub text-center">Введите новый пароль</p>
                    <form @submit.prevent="restorePassword()" class="auth_form w-full">
                        <label class="mb-3 block">
                            <span class="font-bold">Email учетной записи <span class="text-red-500">*</span></span>
                            <input :value="$route.params.email" type="email" class="form-control" placeholder="example@gmail.com" disabled />
                        </label>

                        <label class="mb-3 block">
                            <span class="font-bold">Новый пароль <span class="text-red-500">*</span></span>
                            <PasswordInput v-model="password" />
                        </label>

                        <label class="mb-3 block">
                            <span class="font-bold">Повторите пароль <span class="text-red-500">*</span></span>
                            <PasswordInput v-model="password_confirmation" />
                        </label>

                        <button class="btn btn-primary btn-rounded w-full mb-3" :disabled="loading">
                            <vue-feather v-if="loading" type="settings" animation="spin" animation-speed="slow"></vue-feather>
                            <span v-else>Изменить пароль</span>
                        </button>

                        <div v-if="error_message" class="alert alert-danger text-red-500" role="alert">{{error_message}}</div>
                    </form>
                </div>
            </div>
        </div>
    </auth-layout>
</template>

<script>
import PasswordInput from '~/components/UI/PasswordInput.vue'
import AuthLayout from '~/layouts/auth.vue';
import axios from "axios"
export default {
    components: {
        AuthLayout,
        PasswordInput
    },
    data(){
        return {
            password: null,
            password_confirmation: null,
            error_message: null,
            loading: false
        }
    },
    methods: {
        send(){
            if(this.password === this.password_confirmation){
                this.restorePassword()
            } else {
                this.error_message = 'Пароли не совпадают'
                return false
            }
        },
        async restorePassword(){
            this.loading = true
            axios.post(process.env.VUE_APP_BASE_URL+'reset-password', {
                email: this.$route.params.email,
                password: this.password,
                password_confirmation: this.password_confirmation,
                token: this.$route.params.token
            },{
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                this.loading = false
                this.error_message = null
                if(res.data.success){
                    this.$swal('Ваш пароль успешно изменен', '', 'success')
                    this.$router.push({name: 'login', params: {email: this.$route.params.email} })
                } else {
                    this.error_message = res.data.status
                }
            }).catch(error => {
                this.loading = false
                this.error_message = error.response.data.message
            })
        }
    }
};
</script>

<style>
.auth_logo {
    max-width: 170px;
}
</style>
