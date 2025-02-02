<template>
<div class="content_box p-4 mb-3">
    <div class="content_box__header flex justify-between items-center mb-3 relative z-2">
        <h2 class="title_block mb-2 text-sub">Плательщик</h2>
    </div>
    <label class="mb-3 d-block w-100">
        <span class="font-bold">
            ФИО плательщика
            <span class="text-danger">*</span></span>
        <input v-model="payers_name" type="text" class="form-control" :class="show_errors && !payers_name ? 'invalid' : ''" placeholder="Иван Иванов" required />
        <p v-if="show_errors && !payers_name" class="mb-0 text-sm text-danger">Обязательное поле</p>
    </label>

    <label class="mb-3 d-block w-100">
        <span class="font-bold">Телефон плательщика
            <span class="text-danger">*</span></span>
        <input v-model="payers_phone" type="tel" class="form-control" :class="show_errors && !payers_phone ? 'invalid' : ''" placeholder="+7 (___) ___ ____" v-maska="'+7 (###) ### ####'" required />
        <p v-if="show_errors && !payers_phone" class="mb-0 text-sm text-danger">Обязательное поле</p>
    </label>

    <label class="mb-3 d-block w-100">
        <span class="font-bold">Email плательщика
            <span class="text-danger">*</span></span>
        <input v-model="payers_email" type="email" class="form-control" :class="show_errors && !payers_email ? 'invalid' : ''" placeholder="example@gmail.com" required />
        <p v-if="show_errors && !payers_email" class="mb-0 text-sm text-danger">Обязательное поле</p>
    </label>
</div>
</template>

<script>
import {
    mapGetters
} from "vuex"
import { computed } from 'vue';
export default {
    props: {
        payers_name: {
            type: String,
            default: () => ({}),
        },
        payers_phone: {
            type: String,
            default: () => ({}),
        },
        payers_email: {
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
    computed: {
        ...mapGetters({
            USERDATA: "profile/getUserData",
        }),
    },
    mounted(){
        if(this.USERDATA){
            this.payers_name = this.USERDATA.name
            this.payers_phone = this.USERDATA.phone
            this.payers_email = this.USERDATA.email
        }
    },
    watch:{
        USERDATA: {
            handler(){
                this.payers_name = this.USERDATA.name
                this.payers_phone = this.USERDATA.phone
                this.payers_email = this.USERDATA.email
            },
            deep: true,
        }
    },
    methods: {
        validateFields(){
            if(!this.payers_name || !this.payers_phone || !this.payers_email){
                this.has_errors = true
            } else {
                this.has_errors = false
            }
        }
    },
    beforeUpdate(){
        this.validateFields()
    },
    setup(props, { emit }) {
        const payers_name = computed({  
            get: () => props.payers_name,
            set: (value) => emit('update:payers_name', value),
        });
        const payers_phone = computed({  
            get: () => props.payers_phone,
            set: (value) => emit('update:payers_phone', value),
        });
        const payers_email = computed({  
            get: () => props.payers_email,
            set: (value) => emit('update:payers_email', value),
        });
        const has_errors = computed({  
            get: () => props.has_errors,
            set: (value) => emit('update:has_errors', value),
        });
        return { has_errors, payers_name, payers_phone, payers_email };
    },
    emits: ['update:has_errors','update:payers_name','update:payers_phone','update:payers_email'],
}
</script>

<style>

</style>
