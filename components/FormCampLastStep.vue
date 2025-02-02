<template>
    <p class="font-oswald uppercase text-accent fs-3 font-bold mb-1">
        Заявка сформирована
    </p>
    <p class="font-bold">
        Пожалуйста, внимательно проверьте данные перед отправкой.<br />
        После отправки заявки вы будете перенаправлены на страницу оплаты.
    </p>
    <div class="row g-3 mb-5">
        <div class="col-md-6">
            <OrdersListCamp 
                v-if="postdata.type == 'camp'"
                :camp_shift_id="camp_shift_id"
                :athletes_count="formdata.athletes.length"
                :postdata="postdata" 
                :title="postdata.name"
            />
            <OrdersListMasterClass 
                v-if="postdata.type == 'master_class'"
                :athletes_count="formdata.athletes.length"
                :postdata="postdata" 
                :title="postdata.name"
                :entry_fee="postdata.entry_fee"
            />
        </div>

        <div class="col-md-6">
            <FormPayerFieldgroup 
                v-model:payers_name="payers_name"
                v-model:payers_phone="payers_phone"
                v-model:payers_email="payers_email"
                v-model:has_errors="has_errors"
                :show_errors="show_errors"
            />
            <FormPaymentMethods 
                v-if="postdata.first_status == 'pending_payment'"
                v-model="payment_method"
                :accept_methods="[1]"
                :send_order_btn="true"
                :has_errors="hasErrors()"
                @sendOrder="$emit('sendOrder')"
            />
        </div>
    </div>

    <div class="content_box p-4 mb-4">
        <div class="content_box__header flex justify-between items-center mb-3 relative z-2" >
            <h2 class="title_block mb-2">Данные о мероприятии</h2>
        </div>
        <div class="row g-4">
            <div v-if="postdata.type == 'camp' && postdata.name && postdata.id" class="col-md-3 text-sm">
                <p class="text-sub mb-1">Смена</p>
                <router-link :to="`/stage/${postdata.id}`" class="mb-0 font-bold">
                    {{postdata.name}}
                </router-link>
            </div>
            <div v-if="postdata.type == 'master_class' && postdata.name && postdata.id" class="col-md-3 text-sm">
                <p class="text-sub mb-1">Мастер-класс</p>
                <router-link :to="`/event/${postdata.id}`" class="mb-0 font-bold">
                    {{postdata.name}}
                </router-link>
            </div>
            <div v-if="campShift && campShift.name" class="col-md-2 text-sm">
                <p class="text-sub mb-1">Смена</p>
                <p class="mb-0">
                    {{campShift.name}}
                </p>
            </div>
            <div v-if="campShift && campShift.dates_str" class="col-md-3 text-sm">
                <p class="text-sub mb-1">Даты смены</p>
                <p class="mb-0">
                    {{campShift.dates_str}}
                </p>
            </div>
            <div v-if="postdata.type == 'master_class' && postdata.dates" class="col-md-3 text-sm">
                <p class="text-sub mb-1">Даты</p>
                <p class="mb-0">
                    {{postdata.dates}}
                </p>
            </div>
            <div v-if="postdata.contacts_address" class="col-md-4 text-sm">
                <p class="text-sub mb-1">Место проведения</p>
                <p class="mb-0">
                    {{postdata.contacts_address}}
                </p>
            </div>
            
        </div>
    </div>

    <div class="content_box p-4 mb-4">
        <div class="content_box__header flex justify-between items-center mb-3 relative z-2">
            <h2 class="title_block mb-2">Спортсмены</h2>
        </div>
        <div class="data_table">
            <table class="table table-hover table-responsive">
                <thead>
                    <tr>
                        <th scope="col font-bold text-sm">ФИО</th>
                        <th scope="col font-bold text-sm">Дата рождения</th>
                        <th scope="col font-bold text-sm">Пол</th>
                        <th scope="col font-bold text-sm">Разряд</th>
                        <th scope="col font-bold text-sm">Гражданство</th>
                        <th scope="col font-bold text-sm" class="text-end">Документы</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, i) in formdata.athletes" :key="i">
                        <td class="small">
                            <div class="table_name_item flex items-center">
                                <Avatar :src="item.athlete.avatar" :name="item.athlete.name" :class="'me-2'" />
                                <span class="font-bold lh-1">{{item.athlete.name}}</span>
                            </div>
                        </td>
                        <td class="small align-middle">{{item.athlete.birthdate}}</td>
                        <td class="small align-middle">{{item.athlete.gender == 'M' ? 'Юноша' : 'Девушка'}}</td>
                        <td class="small align-middle">
                            <span v-if="item.athlete.category" class="badge bg-warning">{{item.athlete.category}}</span>
                        </td>
                        <td class="small align-middle">
                            {{item.athlete.nation}}
                        </td>
                        <td class="small align-middle text-end">
                            <vue-feather v-if="item.online_request" type="check-square" class="text-positive"/>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <AdditionalData
        :contacts="{
            name: formdata.agent_name,
            phone: formdata.agent_phone,
            email: formdata.agent_email,
            city: formdata.agent_city,
        }"
    />
</template>

<script>
import FormPaymentMethods from '~/components/forms/FormPaymentMethods.vue'
import OrdersListMasterClass from '~/components/request/OrdersListMasterClass.vue'
import Avatar from '~/components/UI/Avatar.vue'
import OrdersListCamp from '~/components/request/OrdersListCamp.vue'
import FormPayerFieldgroup from './FormPayerFieldgroup'
import AdditionalData from '~/components/request/AdditionalData'
import EstafetasTable from '~/components/request/EstafetasTable'
import SportsmensTable from '~/components/request/SportsmensTable'
import { computed } from 'vue';

export default {
    props: {
        formdata: {
            type: Object,
            required: true
        },
        postdata: {
            type: Object,
            required: true
        },
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
        payment_method: {
            type: Number,
            default: 1,
        },
        has_errors: {
            type: Boolean,
            default: () => (false),
        },
        show_errors: {
            type: Boolean,
            default: () => (false),
        },
        camp_shift_id: {
            type: Number,
            default: null,
        },
    },
    computed: {
        campShift(){
            if(this.postdata.type == 'camp'){
                let camp_shift_id = this.camp_shift_id
                let camp_shift = this.postdata.shifts.find(item => {
                    return item.id == camp_shift_id
                })
                return camp_shift
            }
            return false
        },
    },
    methods:{
        hasErrors(){
            if(!this.payers_name || !this.payers_phone || !this.payers_email){
                return true
            } else {
                return false
            }
        },
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
        const payment_method = computed({  
            get: () => props.payment_method,
            set: (value) => emit('update:payment_method', value),
        });
        const has_errors = computed({  
            get: () => props.has_errors,
            set: (value) => emit('update:has_errors', value),
        });
        return { has_errors, payers_name, payers_phone, payers_email, payment_method };
    },
    emits: ['update:has_errors','update:payers_name','update:payers_phone','update:payers_email','update:payment_method', 'sendOrder'],
    components: {
    FormPayerFieldgroup,
        AdditionalData,
        EstafetasTable,
        SportsmensTable, 
        OrdersListCamp, Avatar, OrdersListMasterClass,
        FormPaymentMethods 
    },
};
</script>

<style>
</style>