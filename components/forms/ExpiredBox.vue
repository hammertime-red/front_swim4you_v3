<template>
    <div v-if="uploaded" class="bg-warning rounded p-4 mb-4">
        <p class="title_block font-bold">Указанные вами дистанции зарезервированы</p>
        <p class="mb-1">Необходимо оформить заказ в течение</p>
        <VueCountdown :time="end_timer" :transform="transformSlotProps" v-slot="{ days, hours, minutes, seconds }" @end="onCountdownEnd">
            <p class="counter font-bold">
                <span v-if="days != '00'">{{days}} дн. </span>  
                <span v-if="hours != '00'">{{hours}} час. </span>  
                <span>{{minutes}} мин. </span>  
                <span>{{seconds}} сек.</span>
            </p>
        </VueCountdown>
        <p class="mb-0">{{bottom_text ? bottom_text : 'Иначе резерв с неоплаченных дистанций будет снят'}}</p>
    </div>
</template>

<script>
import moment from "moment";
import VueCountdown from '@chenfengyuan/vue-countdown';
export default {
    props: {
        time: {
            type: String
        },
        bottom_text: {
            type: String,
        }
    },
    data() {
        return {
            end_timer: null,
            uploaded: false
        }
    },
    async mounted(){
        await this.setTimer()
        this.uploaded = true
    },
    methods: {
        transformSlotProps(props) {
            const formattedProps = {};

            Object.entries(props).forEach(([key, value]) => {
                formattedProps[key] = value < 10 ? `0${value}` : String(value);
            });

            return formattedProps;
        },
        onCountdownEnd() {
            this.$emit('time_end')
        },
        async setTimer(){
            this.end_timer = moment(this.time) - moment()
            if(this.end_timer < 0) this.$emit('time_end')
        },
    },
    emits: ['time_end'],
    components: {VueCountdown},
}
</script>

<style>

</style>