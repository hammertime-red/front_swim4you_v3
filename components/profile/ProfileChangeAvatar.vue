<template>
<div class="content_box p-4 h-full flex flex-col items-start">
    <div class="content_box__header flex justify-between items-center mb-4 relative z-2">
        <h2 class="title_block mb-0">Аватар</h2>
    </div>
    <UploadAvatar v-model="avatar" />
    <button @click.prevent="saveAvatar" class="btn btn-primary btn-rounded mt-auto">Сохранить</button>
</div>
</template>

<script>
import UploadAvatar from '~/components/forms/UploadAvatar.vue'
import axios from "axios"
import {
    mapGetters
} from "vuex"
export default {
    components: {
        UploadAvatar
    },
    data(){
        return {
            avatar: null
        }
    },
    async mounted(){
        if(this.userdata){
            this.avatar = this.userdata.avatar
        }
    },
    computed: {
        ...mapGetters({
            userdata: "profile/getUserData",
        }),
    },
    methods:{
        saveAvatar(){
            axios.post(process.env.VUE_APP_BASE_URL+'account/avatar/edit', this.getFormData() ,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                    'authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            }).then(res => {
                this.$swal('Изменения сохранены', '', 'success')
            }).catch(error => {
                console.log(error)
                this.error_message = error.response.data.message
                this.$swal(error.response.data.message, '', 'danger')
            })
        },
        getFormData(){
            let fd = new FormData();
            if(this.avatar){
                fd.append('avatar', this.avatar)
            } else {
                fd.append('avatar', null)
            }
            
            return fd
        },
    }
}
</script>

<style>

</style>
