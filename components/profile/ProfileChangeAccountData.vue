<template>
<div class="content_box p-4 h-full flex flex-col items-start">
    <form @submit.prevent="storeData">
        <div class="content_box__header flex justify-between items-center mb-4 relative z-2">
            <h2 class="title_block mb-0">Учетные данные</h2>
        </div>
        <label class="mb-3 block w-full">
            <span class="font-bold">Ваше ФИО <span class="text-red-500">*</span></span>
            <input v-model="form_data.name" type="text" class="form-control" placeholder="Иван Иванов" required />
        </label>

        <label class="mb-3 block w-full">
            <span class="font-bold">Email <span class="text-red-500">*</span></span>
            <input v-model="form_data.email" type="email" class="form-control" placeholder="example@gmail.com" required />
        </label>

        <label class="mb-3 block w-full">
            <span class="font-bold">Телефон <span class="text-red-500">*</span></span>
            <input v-model="form_data.phone" type="tel" class="form-control" placeholder="+7 (___) ___ ____" v-maska="'+7 (###) ### ####'" required />
        </label>
        <button type="submit" class="btn btn-primary btn-rounded mt-auto">Сохранить</button>
    </form>
</div>
</template>

<script>
import api from '@/store/api'
import {
    mapGetters
} from "vuex"
export default {
    data(){
        return {
            form_data: {
                name: null,
                email: null,
                phone: null
            }
        }
    },
    async mounted(){
        if(this.userdata){
            this.form_data.name = this.userdata.name
            this.form_data.email = this.userdata.email
            this.form_data.phone = this.userdata.phone
        }
    },
    computed: {
        ...mapGetters({
            userdata: "profile/getUserData",
        }),
    },
    methods: {
        storeData(){
            api.post(process.env.VUE_APP_BASE_URL+'account/userdata/edit', this.form_data).then(res => {
                this.$swal('Изменения сохранены', '', 'success')
            }).catch(error => {
                console.log(error)
                this.error_message = error.response.data.message
                this.$swal(error.response.data.message, '', 'danger')
            })
        },
    }
}
</script>

<style>

</style>
