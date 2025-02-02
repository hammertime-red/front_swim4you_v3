<template>
    <with-sidebar-layout v-if="isPostDataLoaded">
        <template #head>
            <page-title title="Форма заявки" :breadcrumbs="breadcrumbs" />
            <PageAlertBox v-for="(item, i) in alerts" :key="i" :alert="item" />
            <PageAlertBox
                v-if="hasErrors() && show_errors"
                :alert="{
                    class: 'alert-danger',
                    title: 'Форма содержит ошибки',
                    text: 'Пожалуйста, проверьте правильность заполнения полей',
                }"
                ref="alert_form_errors" />
        </template>
        <template #content>
            <FormSteps :steps="steps" :activeStep="activeStep" />

            <div class="form_step" v-if="activeStep === 1">
                <FormContactsFieldgroupCamp
                    v-model:agent_name="form_data.agent_name"
                    v-model:agent_phone="form_data.agent_phone"
                    v-model:agent_email="form_data.agent_email"
                    v-model:agent_city="form_data.agent_city"
                    v-model:has_errors="contacts_has_errors"
                    :show_errors="show_errors"
                />
                <FormAthletesSetCamp
                    v-model="form_data.athletes"
                    v-model:has_errors="athletes_has_errors"
                    :required_documents="postData.athlete_documents" :allowed_distances="null"
                    :show_errors="show_errors"
                    title="Добавьте спортсменов"
                    subtitle="Добавьте необходимое кол-во спортсменов и прикрепите документы для подачи онлайн-заявки."
                />
            </div>

            <div class="form_step" v-if="activeStep === 2">
                <FormCampLastStep
                    v-model:payers_name="form_data.payers_name"
                    v-model:payers_phone="form_data.payers_phone"
                    v-model:payers_email="form_data.payers_email"
                    v-model:payment_method="form_data.payment_method"
                    v-model:has_errors="last_step_errors"
                    :camp_shift_id="form_data.event_child_id"
                    :formdata="form_data"
                    :postdata="postData"
                    :show_errors="show_errors"
                    @sendOrder="sendOrder()"
                />
            </div>

            <div class="content_box p-4 mb-4" v-if="activeStep == steps.length">
                <FormAcceptChecks
                    v-model:accept_checks="accept_checks"
                    v-model:activeStep="activeStep"
                    :show_errors="show_errors"
                    :has_errors="hasErrors()"
                    :hasLastErrors="hasLastErrors()"
                    :first_status="postData.first_status"
                    @sendOrder="sendOrder()"
                    @saveAsDraft="sendOrder('draft')"
                />
            </div>

            <div class="stepform_actions rounded mb-5" v-if="activeStep != steps.length">
                <div class="row g-3 justify-content-end mt-4 p-3 pt-0">
                    <div class="col-md-4">
                        <button @click.prevent="activeStep = activeStep - 1" v-if="activeStep > 1" class="btn btn-outline btn-outline-secondary btn-rounded w-full">Назад</button>
                    </div>
                    <div class="col-md-4">
                    </div>
                    <div class="col-md-4">
                        <button @click.prevent="nextStep" class="btn btn-primary btn-rounded w-full">Далее</button>
                    </div>
                </div>
            </div>
        </template>

        <template #sidebar>
            <InstructionsBox
                :button_disabled="false"
                @saveAsDraft="sendOrder('draft')"
            />
        </template>
        <template #offcanvas>
            <EditAthlet />
            <AddDocuments />
        </template>
    </with-sidebar-layout>
</template>

<script>
import FormAthletesSetCamp from '~/components/FormAthletesSetCamp.vue'
import FormAcceptChecks from '~/components/FormAcceptChecks.vue'
import FormCampLastStep from '~/components/FormCampLastStep.vue'
import FormContactsFieldgroupCamp from '~/components/FormContactsFieldgroupCamp.vue'
import AddDocuments from '~/components/forms/AthleteDocumentsForm.vue'
import EditAthlet from '~/components/offcanvases/EditAthlet.vue'
import AthletFieldgroupCamp from '~/components/forms/AthletFieldgroupCamp.vue'
import FormSteps from '~/components/forms/FormSteps.vue'
import PageAlertBox from '~/components/PageAlertBox.vue'
import PageTitle from '~/components/PageTitle.vue'
import InstructionsBox from '~/components/forms/InstructionsBox.vue'
import WithSidebarLayout from '@/layouts/WithSidebarLayout.vue'
import moment from 'moment'
/*import {
    useToast
} from 'vue-toastification'*/
import api from '@/store/api'


definePageMeta({
    name: 'order_master_class_create'
})

export default {
    props: {
        postData: {
            type: Object,
            default: {}
        },
        orderdata: {
            type: Object,
            default: {}
        },
    },
    data() {
        return {
            form_data: {
                type: 'camp',
                event_id: null,
                event_child_id: null,
                agent_name: null,
                agent_phone: null,
                agent_email: null,
                agent_city: null,
                payers_name: null,
                payers_phone: null,
                payers_email: null,
                payment_method: 1,
                athletes: [
                    {
                        athlete_id: null,
                        online_request: false,
                        athlete_documents: [],
                    }
                ],
            },
            breadcrumbs: [],
            alerts: [{
                class: 'alert-warning',
                title: 'Внимание!',
                text: 'В соотвествии с регламентом по организации и проведению официальных физкультурных и спортивных мероприятий на территории Российской Федерации в условиях сохранения рисков распространения COVID-19, все участники соревонований (спортсмены, тренеры, судьи, обслуживающий персонал, СМИ и т.д.) должны будут предъявить на комиссии по допуску 18 июня 2021 г. справку о наличии отрицательного результата исследования на COVID-19 методом ПЦР, проведенного не ранее 72 часов (3 суток) до прибытия на место проведения соревнования (18 июня)',
            }],
            activeStep: 1,
            payment_method: 1,
            steps: [{
                id: 1,
                name: "Формирование заявки",
                isSuccess: false
            },
                {
                    id: 2,
                    name: "Подтверждение",
                    isSuccess: false
                }
            ],
            accept_checks: [
                {
                    text: 'С <a href="/page/8" class="text-dark" target="_blank">политикой конфиденциальности</a> ознакомлен и согласен',
                    check: false
                },
            ],
            show_errors: false,
            contacts_has_errors: false,
            athletes_has_errors: false,
            last_step_errors: false,
        }
    },
    methods: {
        setPostData(){
            if(this.isPostDataLoaded()){
                if(this.postData.type == 'camp'){
                    if(!this.$route.query.shift && !this.orderdata.event_stage_id){
                        this.$swal('Неизвестный ID смены', '', 'danger')
                        this.$router.go(-1)
                        return false
                    }
                    let shift_id = null
                    if(this.orderdata.event_stage_id){
                        shift_id = this.orderdata.event_stage_id
                    } else {
                        shift_id = this.$route.query.shift
                    }
                    let shift = this.postData.shifts.find(item => {
                        return item.id == shift_id
                    })
                    if(!shift){
                        this.$swal('Несуществующий ID смены', '', 'danger')
                        this.$router.go(-1)
                        return false
                    }
                    if(shift.tickets_count < 1){
                        this.$swal('В этой смене нет мест', '', 'danger')
                        this.$router.go(-1)
                        return false
                    }
                    this.form_data.event_child_id = parseInt(shift_id)
                }
                this.breadcrumbs.push({
                    title: this.postData.name,
                    link: '/event/'+this.postData.id
                })
                this.form_data.type = this.postData.type
                if(this.orderdata.event_id){
                    this.form_data.event_id = this.postData.event_id
                } else {
                    this.form_data.event_id = this.postData.id
                }
            }
        },
        isPostDataLoaded(){
            if(_.isEmpty(this.postData)){
                return false
            }
            return true
        },
        showToast(text) {
            const toast = useToast()
            toast.info(text);
        },
        nextStep(){
            if(this.hasErrors()){
                this.show_errors = true
                this.$nextTick(() => {this.$el.querySelector('.invalid').focus()})
            } else {
                this.activeStep++
            }
        },
        hasErrors(){
            if(this.contacts_has_errors || this.athletes_has_errors){
                return true
            } else {
                return false
            }
        },
        hasLastErrors(){
            if(this.last_step_errors || this.accept_checks.find(item => item.check == false)){
                return true
            } else {
                return false
            }
        },
        sendOrder(status){
            if(this.hasLastErrors()){
                this.show_errors = true
                this.$nextTick(() => {this.$el.querySelector('.invalid').focus()})
            } else {
                if(status != 'draft' && this.postData.first_status == 'pending_payment'){
                    this.$swal({
                        title: 'Перенаправление на форму оплаты',
                        text: 'Пожалуйста, не закрывайте страницу',
                        icon: 'info',
                        allowOutsideClick: false,
                        allowEnterKey: false,
                        allowEnterKey: false,
                        showConfirmButton: false,
                        didOpen: () => {
                            this.$swal.showLoading()
                        },
                    })
                }
                this.storeOrder(status ? status : this.postData.first_status)
            }
        },
        storeOrder(status = 'draft'){
            this.form_data.status = status
            api.post(process.env.VUE_APP_BASE_URL+'order/create', this.form_data).then(res => {
                if(res.data && res.data.success){
                    if(status == 'draft'){
                        this.showToast('Заказ сохранен как черновик')
                        this.$router.push({name: 'profile'})
                    }
                    else if(status == 'pending_payment' && res.data.url) {
                        window.location.href = res.data.url;
                    }
                    else{
                        this.showToast('Заказ отправлен')
                        this.$router.push({name: 'profile'})
                    }
                }else{
                    console.log(res.data)
                    this.$swal('Возникла неизвестная ошибка, попробуйте еще раз', '', 'danger')
                }
            }).catch(error => {
                console.log('Catch', error, error.response)
                if(error.response && error.response.data.message){
                    this.$swal(error.response.data.message, '', 'danger')
                }
            })
        },
        transformOrderData(){
            if(!_.isEmpty(this.orderdata)){
                this.form_data.id = this.orderdata.id
                this.form_data.type = this.orderdata.type
                this.form_data.event_id = this.orderdata.event_id
                this.form_data.event_child_id = this.orderdata.event_stage_id
                this.form_data.agent_name = this.orderdata.agent_name
                this.form_data.agent_phone = this.orderdata.agent_phone
                this.form_data.agent_email = this.orderdata.agent_email
                this.form_data.agent_city = this.orderdata.agent_city

                if(this.orderdata.athletes && this.orderdata.athletes.length > 0){
                    let athletes_array = []
                    this.orderdata.athletes.forEach((item, i) => {
                        let online_request = false
                        if(!_.isEmpty(item.athlete_documents)){
                            online_request = true
                        }
                        athletes_array.push({
                            athlete_id: item.id,
                            athlete_documents: item.athlete_documents,
                            online_request: online_request
                        })
                    })
                    if(!_.isEmpty(athletes_array)) this.form_data.athletes = athletes_array
                }
            }
        }
    },
    async mounted(){
        this.setPostData()
        this.transformOrderData()
    },
    async beforeUpdate(){
        this.setPostData()
    },
    components: {
        WithSidebarLayout,
        InstructionsBox,
        PageTitle,
        PageAlertBox,
        FormSteps,
        AthletFieldgroupCamp,
        EditAthlet,
        AddDocuments,
        FormContactsFieldgroupCamp, FormCampLastStep, moment, FormAcceptChecks,
        FormAthletesSetCamp
    },
}
</script>

<style>

</style>
