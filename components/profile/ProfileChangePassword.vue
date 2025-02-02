<template>
<div class="content_box p-4 h-full flex flex-col items-start">
    <div class="content_box__header flex justify-between items-center mb-4 relative z-2">
        <h2 class="title_block mb-0">Сменить пароль</h2>
    </div>
    <form @submit.prevent="storeData">
        <label class="mb-3 block w-full">
            <div class="flex justify-between">
                <span class="font-bold">Текущий пароль</span>
                <a href="#" class="small text-sub">Забыли пароль?</a>
            </div>
            <PasswordInput v-model="form_data.old_password" />
        </label>

        <label class="mb-3 block w-full">
            <span class="font-bold">Новый пароль</span>
            <PasswordInput v-model="form_data.password_confirmation" />
        </label>

        <label class="mb-3 block w-full">
            <span class="font-bold">Повторите пароль</span>
            <PasswordInput v-model="form_data.password" />
        </label>

        <p v-if="error_message" class="text-red-500">{{error_message}}</p>

        <button type="submit" class="btn btn-primary btn-rounded mt-auto">Сохранить</button>
    </form>
</div>
</template>

<script>
import PasswordInput from '../UI/PasswordInput'
import api from '@/store/api'
export default {
  components: { PasswordInput },
    data(){
        return {
            form_data: {
                password: null,
                password_confirmation: null,
                old_password: null,
            },
            error_message: null
        }
    },
    methods: {
        storeData(){
            if(this.form_data.password !== this.form_data.password_confirmation){
                this.error_message = 'Пароли не совпадают'
                return
            }
            api.post(process.env.VUE_APP_BASE_URL+'account/password/edit', this.form_data).then(res => {
                if(res && res.data.success){
                    this.$swal('Изменения сохранены', '', 'success')
                } else {
                    this.$swal('Неверный пароль', '', 'warning')
                }
            }).catch(error => {
                console.log(error)
                this.error_message = error.response.data.message
                this.$swal(error.response.data.message, '', 'danger')
            })
        },
    }
}
</script>

<style scoped>
    form{
        width: 100%;
    }
</style>
