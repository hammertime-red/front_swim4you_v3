<template>
    <div>
        <FormSteps :steps="steps" :activeStep="activeStep" class="mt-10" />

        <FormEventStepDistances v-if="activeStep === 'distances'" @next-step="nextStep" @time-end="timeEnd" />
        <FormEventStepRelays v-if="postData?.relays && postData.relays.length && activeStep === 'relays'" @prev-step="prevStep" @next-step="nextStep" @time-end="timeEnd" />
        <FormEventStepExtra v-if="postData?.extra_services && postData.extra_services.length && activeStep === 'extra_items'" @prev-step="prevStep" @next-step="nextStep" @time-end="timeEnd" />
        <FormEventConfirm v-if="activeStep === 'confirm'" @time-end="timeEnd" @prev-step="prevStep" />
    </div>
</template>

<script setup>
import FormSteps from "~/components/forms/FormSteps.vue";
import FormEventStepDistances from "~/components/forms/event/FormEventStepDistances.vue";
import FormEventStepRelays from "~/components/forms/event/FormEventStepRelays.vue";
import FormEventStepExtra from "~/components/forms/event/FormEventStepExtra.vue";
import FormEventConfirm from "~/components/forms/event/FormEventConfirm.vue";

const props = defineProps({
    postData: {
        type: Object,
        required: true
    },
    orderData: {
        type: Object,
        default: () => {}
    }
})

const emit = defineEmits(['refreshOrderData', 'changeStep']);

provide('postData', props.postData)
provide('orderData', computed(() => props.orderData))

const activeStep = ref('distances')
watch(activeStep, (value) => {
    emit('changeStep')
})
const steps = computed(() => {
    let steps = [
        {
            id: 'distances',
            name: 'Формирование заявки',
        },
    ]

    if (props.postData?.relays && props.postData?.relays.length) {
        steps.push({
            id: 'relays',
            name: 'Участие в эстафетах',
        })
    }
    if (props.postData?.extra_services && props.postData?.extra_services.length) {
        steps.push({
            id: 'extra_items',
            name: 'Дополнительные услуги',
        })
    }

    steps.push({
        id: 'confirm',
        name: 'Подтверждение',
    })

    return steps
})

function timeEnd(){
    emit('refreshOrderData')
    activeStep.value = 'distances'
}

async function storeFormDraft() {
    this.$swal({
        title: 'Сохранение заявки',
        text: 'Пожалуйста, не закрывайте страницу',
        icon: 'info',
        allowOutsideClick: false,
        allowEnterKey: false,
        showConfirmButton: false,
        didOpen: () => {
            this.$swal.showLoading()
        },
    })

    let response = await this.confirmForm({
        request: this.getFormData(),
        action: 'draft'
    })
    if (response?.success && response?.order_id) {
        if (!this.form.order_id) {
            this.$router.replace({ name: 'order_edit', params: { id: response.order_id } })
            return
        }
        this.$swal.close()
        this.showToast('Заявка сохранена')
    } else {
        this.$swal(
            'Ошибка при сохранении заявки',
            response?.message ?? 'Пожалуйста, попробуйте еще раз',
            'error'
        )
    }
}

async function nextStep() {
    console.log('nextStep')
    const current_step_index = steps.value.findIndex((item) => item.id === activeStep.value)
    activeStep.value = steps.value[current_step_index + 1]?.id ?? steps.value[0].id
}

async function prevStep() {
    const current_step_index = steps.value.findIndex((item) => item.id === activeStep.value)
    activeStep.value = steps.value[current_step_index - 1]?.id ?? steps.value[0].id
}


/*

const postData = ref(null)
const orderdata = ref(null)

const expired_time = ref(null)


onMounted(async () => {
    if (props.postData && !_.isEmpty(props.postData)) {
        this.setFormFromPost()
    }
    if (orderdata.value && !_.isEmpty(orderdata.value)) {
        this.setOrderData(orderdata.value)
        //this.transformOrderData()
        //this.addDistancesPrice()
    } else {
        //this.setDefaultForm()
    }
})




async function storeFormRelays() {
    if(!this.form_elements.relay_items.length && !this.orderdata.relay_items.length) return
    if(_.isEqual(this.form_elements.relay_items, this.orderdata.relay_items)) return

    this.$swal({
        title: 'Сохранение эстафет',
        text: 'Пожалуйста, не закрывайте страницу',
        icon: 'info',
        allowOutsideClick: false,
        allowEnterKey: false,
        showConfirmButton: false,
        didOpen: () => {
            this.$swal.showLoading()
        },
    })

    let response = await this.storeRelayItems({
        relay_items: this.form_elements.relay_items,
        order_id: this.form.order_id
    })

    if (response?.success) {
        this.$swal.close()
    } else {
        this.$swal(
            'Ошибка при сохранении эстафет',
            response?.message ?? 'Пожалуйста, попробуйте еще раз',
            'error'
        )
        throw new Error(response?.message);
    }
}

async function storeFormExtra() {
    if(!this.form_elements.extra_items.length && !this.orderdata.extra_items.length) return
    if(_.isEqual(this.form_elements.extra_items, this.orderdata.extra_items)) return

    this.$swal({
        title: 'Сохранение дополнительных услуг',
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

    let response = await this.storeExtraItems({
        extra_items: this.form_elements.extra_items,
        order_id: this.form.order_id
    })

    if (response?.success) {
        this.$swal.close()
    } else {
        this.$swal(
            'Ошибка при сохранении дополнительных услуг',
            response?.message ?? 'Пожалуйста, попробуйте еще раз',
            'error'
        )
        throw new Error(response?.message);
    }
}

async function storeFormConfirm() {
    if (this.hasErrors || this.hasLastErrors) {
        this.show_errors = true
        return
    }

    this.$swal({
        title: 'Отправка заявки',
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

    let response = await this.confirmForm({
        order_id: this.form.order_id,
        payers_name: this.form.payers_name,
        payers_phone: this.form.payers_phone,
        payers_email: this.form.payers_email,
        payment_method: this.form.payment_method,
    })
    if (response?.success && response?.url) {
        window.location.href = url
    } else if(response?.success) {
        this.$swal.close()
        this.showToast('Заявка успешно отправлена')
        this.$router.push({name: 'order', params: { id: this.form.order_id}})
    } else {
        this.$swal(
            'Ошибка при отправке заявки',
            response?.message ?? 'Пожалуйста, попробуйте еще раз',
            'error'
        )
    }
}


function setDefaultForm() {
    this.form_elements.items.push({ ...itemTemplate })
}


function setFormFromPost() {
    this.form.event_id = props.postData.event_id
    this.form.event_child_id = props.postData.id
    this.form.entry_fee = props.postData.entry_fee
    if (props.postData?.accept_checkboxes) {
        this.accept_checks = props.postData.accept_checkboxes.map((obj) => ({
            ...obj,
            check: false,
        }))
    }
}
function showToast(text) {
    const toast = useToast()
    toast.info(text)
}
function prevStep() {
    let current_step_index = steps.value.findIndex((item) => item.id == activeStep.value)
    activeStep.value = steps.value[current_step_index - 1]?.id ?? steps.value[0].id
}
async function nextStep() {
    if (this.hasErrors) {
        this.show_errors = true
        this.$nextTick(() => {
        })
        return
    }
    if(activeStep.value == 'relay_races'){
        await this.storeFormRelays()
    }
    if(activeStep.value == 'extra_items'){
        await this.storeFormExtra()
    }
    let current_step_index = steps.value.findIndex((item) => item.id == activeStep.value)
    activeStep.value = steps.value[current_step_index + 1]?.id ?? steps.value[0].id
}





watch(activeStep, (value) => {
    if (val === 'confirm') {
        this.shop_modal_visible = true
    }
})

provide('postData', postData)
provide('orderdata', orderdata)
*/

/*...mapActions({
    storeForm: 'order/storeForm',
    confirmForm: 'order/confirmForm',
    expireOrder: 'order/expireOrder',
    storeExtraItems: 'order/storeExtraItems',
    storeRelayItems: 'order/storeRelayItems',
}),*/
</script>

<style>
.bottom_form_navbar {
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 9;
    box-shadow: -5px 0 5px rgba(0,0,0,.05);
}
</style>
