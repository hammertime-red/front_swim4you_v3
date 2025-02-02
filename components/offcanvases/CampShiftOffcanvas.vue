<template>
<Modal id="camp_shift">
<div class="title_section row justify-between mb-4">
    <div class="col-md-8">
        <p v-if="offcanvasData && offcanvasData.name" class="section_title_medium mb-1">{{offcanvasData.name}}</p>
        <p v-if="offcanvasData && offcanvasData.dates_str"  class="font-bold mb-2">{{offcanvasData.dates_str}}</p>
    </div>
    <div class="col-md-4 text-md-end">
        <span v-if="status == 'open'" class="badge bg-positive">
                Есть места
        </span>
        <span
            v-if="status == 'last_places'"
            class="badge bg-warning"
        >
            Осталось {{ offcanvasData.tickets_count }} мест
        </span>
        <span
            v-if="status == 'end_places'"
            class="badge bg-destructive"
        >
            Нет мест
        </span>
        <span v-if="status == 'end_event'" class="badge bg-destructive">
            Смена завершена
        </span>
        <span v-if="status == 'closed'" class="badge bg-destructive">
            Регистрация закрыта
        </span>

    </div>
</div>

<div v-if="offcanvasData && offcanvasData.desc" class="body_section mb-4">
    {{offcanvasData.desc}}
</div>

<div v-if="offcanvasData && offcanvasData.trainers" class="trainers_section mb-4">
    <p class="font-bold mb-2">Тренеры</p>
    <TrainersRow :items="offcanvasData.trainers" :className="'col-md-6'" />
</div>

<div v-if="status == 'open' || status == 'last_places'" class="text-center">
    <NuxtLink
        :to="{
            name: 'event_form',
            query: { id: offcanvasData.eventId, shift: offcanvasData.id, type: 'camp' },
        }"
        @click="globalStore.closeOffcanvas('camp_shift')"
        class="btn btn-primary btn-primary-shadow btn-rounded"
        >Подать заявку</NuxtLink>
</div>

<form v-if="status == 'closed' && !form.is_sent" @submit.prevent="sendForm()">
    <div class="row g-4">
        <div class="col-12">
            <p class="mb-0 font-bold">Оставьте свой email и как только смена станет доступна для заказа - вам придет оповещение</p>
        </div>
        <div class="col-md-7">
            <label class="d-block w-full">
                <span class="font-bold">Ваш email <span class="text-red-500">*</span></span>
                <input v-model="form.email" type="email" class="form-control" placeholder="example@example.ru" required />
            </label>
        </div>
        <div class="col-md-5 flex align-items-end">
            <button class="btn btn-primary btn-primary-shadow btn-rounded px-5 mb-1">В лист ожидания</button>
        </div>
    </div>
</form>

<div v-if="form.is_sent" class="form_sent">
    <p class="title font-bold text-positive">Смена добавлена в лист ожидания</p>
    <p>Мы обязательно отправим вам оповещение, как только смена станет доступна для заказа</p>
</div>


</Modal>
</template>

<script>
import TrainersRow from '../UI/TrainersRow.vue'
import Modal from './Modal.vue'
import moment from "moment";

import {useGlobalStore} from '@/store/globalStore'
export default {
    components: {
        Modal, TrainersRow
    },
    data(){
        return {
            form:{
                email: '',
                is_sent: false
            }
        }
    },
    setup() {
        const globalStore = useGlobalStore();
        return {
            globalStore
        };
    },
    methods: {
        sendForm(){
            this.form.is_sent = true
            return true
        },
    },
    computed: {
        status() {
            if(this.globalStore.offcanvasData){
                if (this.globalStore.offcanvasData.open && this.globalStore.offcanvasData.tickets_count > 10) {
                    return "open";
                }

                if (this.globalStore.offcanvasData.open && this.globalStore.offcanvasData.tickets_count <= 10) {
                    return "last_places";
                }

                if (this.globalStore.offcanvasData.open && this.globalStore.offcanvasData.tickets_count <= 0) {
                    return "end_places";
                }

                let now = moment();
                let date_end = moment(this.globalStore.offcanvasData.dates.end, "YYYY-MM-DD");
                if (now >= date_end) {
                    return "end_event";
                }
            }
            return "closed";
        },
    }
}
</script>

<style scoped>
.badge{
    font-family: "Oswald", sans-serif;
    font-weight: 700;
    font-size: 18px;
    text-transform: uppercase;
}

.btn{
    padding-left: 45px;
    padding-right: 45px;
}

form {
    border: 1px solid #E9EBF1;
    border-radius: 10px;
    padding: 30px;
}

form button {
    padding-top: 10px;
    padding-bottom: 10px;
}

.form_sent .title{
    font-size: 20px;
}

@media(max-width: 768px){
    .btn{
        padding-left: 20px;
        padding-right: 20px;
    }

    .badge{
        font-size: 16px;
    }
}

</style>
