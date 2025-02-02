<template>
<div v-if="loaded">
    <FormCompetition v-if="this.$route.query.type == 'competition' && STAGE" :postData="STAGE" />
    <FormCampView v-if="(this.$route.query.type == 'camp' || this.$route.query.type == 'master_class') && EVENT" :postData="EVENT" />
</div>
</template>

<script>
import FormCampView from './FormCampView.vue'
import FormCompetition from './event/FormEvent.vue'
import {
    mapGetters, mapActions
} from "vuex";
import moment from 'moment'
import setMeta from "~/components/seoMeta"
export default {
    props: ['id', 'type'],
    data(){
        return {
            loaded: false,
        }
    },
    async mounted() {
        await this.routeForm()
        this.checkExpirationEvent()
    },
    methods: {
        ...mapActions({
            fetchEvent: "events/fetchEvent",
            fetchStage: "events/fetchStage",
            fetchFormStage: "events/fetchFormStage",
        }),
        async routeForm(){
            if(!this.$route.query.type || !this.$route.query.id){
                this.$swal({
                    title: 'Неверная ссылка',
                    text: 'Пожалуйста проверьте правильность написания ссылки или обратитесь к администратору сайта',
                    icon: 'error',
                }).then((value) => {
                    this.$router.go(-1)
                });
                return false
            }
            await this.fetchData()
            this.loaded = true
        },
        async fetchData(){
            if(this.EVENT.id == this.$route.query.id) return;
            
            if(this.$route.query.type == 'camp' || this.$route.query.type == 'master_class'){
                await this.fetchEvent(this.$route.query.id)
            } else if(this.$route.query.type == 'competition') {
                await this.fetchFormStage(this.$route.query.id)
            } else {
                this.$router.push({name: 'not_found'})
            }
        },
        checkExpirationEvent(){
            if(this.STAGE){
                if(moment(this.STAGE.current_time, 'DD-MM-YYYY HH:mm') < moment(this.STAGE.start_registration_date, 'DD-MM-YYYY HH:mm')){
                    this.$router.go(-1)
                    this.$swal({
                        title: 'Регистрация на событие еще не началась',
                        text: 'Пожалуйста, зарегистрируйтесь позже',
                        icon: 'error',
                    });
                }
                if(moment(this.STAGE.current_time, 'DD-MM-YYYY HH:mm') > moment(this.STAGE.end_registration_date, 'DD-MM-YYYY HH:mm')){
                    this.$router.go(-1)
                    this.$swal({
                        title: 'Регистрация на событие уже окончена',
                        icon: 'error',
                    });
                }
            }
        }
    },
    computed: {
        ...mapGetters({
            EVENT: "events/getEventPost",
            STAGE: "events/getFormStagePost",
        }),
    },
    components: {
        FormCompetition, FormCampView
    },
    metaInfo() {
        return setMeta(
            `Форма заявки | Swim4you.ru`, 
            null, 
            null,
            false
        )
    },
}
</script>

<style>

</style>
