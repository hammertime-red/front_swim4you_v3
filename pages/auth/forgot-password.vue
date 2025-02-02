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
                    <p class="text-sub text-center">Пожалуйста, укажите email учетной записи, на который будет выслана ссылка для восстановления пароля</p>
                    <form @submit.prevent="restorePassword()" class="auth_form w-full">
                        <label class="mb-3 block">
                            <span class="font-bold">Email учетной записи <span class="text-red-500">*</span></span>
                            <input v-model="email" type="email" class="form-control" placeholder="example@gmail.com" autocomplete="on" required />
                        </label>

                        <button class="btn btn-primary btn-rounded w-full mb-3" :disabled="loading">
                            <vue-feather v-if="loading" type="settings" animation="spin" animation-speed="slow"></vue-feather>
                            <span v-else>Отправить</span>
                        </button>

                        <div v-if="error_message" class="alert alert-danger text-red-500" role="alert">{{error_message}}</div>
                    </form>
                    <div class="auth_other">
                        <NuxtLink to="/auth" class="text-decoration-none">Назад</NuxtLink>
                    </div>
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
            email: null,
            error_message: null,
            loading: false,
        }
    },
    methods: {
        async restorePassword(){
            this.loading = true
            axios.post(process.env.VUE_APP_BASE_URL+'forgot-password', {
                email: this.email,
            },{
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                this.error_message = null
                this.loading = false
                if(res.data.success){
                    this.$swal('Ссылка на изменение пароля отправлена на ваш email', '', 'success')
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
