<template>
<div class="content_box p-4 mb-5">
    <div class="content_box__header">
        <div class="row gy-3">
            <div class="col-md-8">
                <h2 class="title_block mb-4">Добавьте контакты представителя</h2>
            </div>
            <div class="col-md-4 mb-3 mb-md-0">
                <div class="form-check">
                    <label class="form-check-label text-sm font-bold" for="auth_accept">
                        Представитель – это я
                    </label>
                    <input v-model="its_me" @change="itsMeMario" class="form-check-input" type="checkbox" value="1" id="auth_accept" required>
                </div>
            </div>
        </div>
    </div>
    <div class="row g-3">
        <div class="col-lg-6 col-xl-4">
            <label class="d-block">
                <span class="font-bold">ФИО представителя <span class="text-danger">*</span></span>
                <input v-model="agent_name" type="text" class="form-control" :class="show_errors && !agent_name ? 'invalid' : ''" placeholder="Иванов Иван Иванович" required>
                <p v-if="show_errors && !agent_name" class="mb-0 text-sm text-danger">Обязательное поле</p>
            </label>
        </div>
        <div class="col-lg-6 col-xl-4">
            <label class="d-block">
                <span class="font-bold">Телефон <span class="text-danger">*</span></span>
                <input 
                    v-model="agent_phone" 
                    type="tel" 
                    class="form-control" 
                    :class="show_errors && !agent_phone ? 'invalid' : ''" 
                    v-maska="'+7 (###) ### ####'"
                    placeholder="+7 (___) ___ ____" 
                    required>
                <p v-if="show_errors && !agent_phone" class="mb-0 text-sm text-danger">Обязательное поле</p>
            </label>
        </div>
        <div class="col-lg-6 col-xl-4">
            <label class="d-block">
                <span class="font-bold">Email <span class="text-danger">*</span></span>
                <input v-model="agent_email" type="email" class="form-control" :class="show_errors && !agent_email ? 'invalid' : ''" placeholder="example@example.ex" required>
                <p v-if="show_errors && !agent_email" class="mb-0 text-sm text-danger">Обязательное поле</p>
            </label>
        </div>

    </div>
</div>
</template>

<script>
import { computed } from 'vue';
import {
    mapGetters
} from "vuex"
export default {
    props: {
        agent_name: {
            type: String,
            default: () => ({}),
        },
        agent_phone: {
            type: String,
            default: () => ({}),
        },
        agent_email: {
            type: String,
            default: () => ({}),
        },
        has_errors: {
            type: Boolean,
            default: () => (false),
        },
    },
    inject: {
        show_errors: {
            from: 'show_errors',
            default: false
        },
    },
    emits: ['update:agent_name','update:agent_phone','update:agent_email','update:has_errors',],
    setup(props, { emit }) {
        const agent_name = computed({  
            get: () => props.agent_name,
            set: (value) => emit('update:agent_name', value),
        });
        const agent_phone = computed({  
            get: () => props.agent_phone,
            set: (value) => emit('update:agent_phone', value),
        });
        const agent_email = computed({  
            get: () => props.agent_email,
            set: (value) => emit('update:agent_email', value),
        });
        const has_errors = computed({  
            get: () => props.has_errors,
            set: (value) => emit('update:has_errors', value),
        });
        return { agent_name, agent_phone, agent_email, has_errors};
    },
    data(){
        return {
            its_me: false
        }
    },
    methods:{
        itsMeMario(e){
            if(this.its_me){
                if(this.USERDATA.name) this.agent_name = this.USERDATA.name
                if(this.USERDATA.phone) this.agent_phone = this.USERDATA.phone
                if(this.USERDATA.email) this.agent_email = this.USERDATA.email
            } else {
                this.agent_name = null
                this.agent_phone = null
                this.agent_email = null
            }
        },
        validateFields(){
            if(!this.agent_name || !this.agent_phone || !this.agent_email){
                this.has_errors = true
            } else {
                this.has_errors = false
            }
        }
    },
    computed: {
        ...mapGetters({
            USERDATA: "profile/getUserData",
        }),
    },
    beforeUpdate(){
        this.validateFields()
    }
}
</script>

<style>

</style>
