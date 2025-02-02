<template>
<div class="instruction_box sticky_box bg-secondary rounded p-4 text-white mb-4">
    <p class="font-bold text-accent">Пожалуйста, внимательно заполните все поля формы и
        добавьте данные участников для подачи заявки.</p>
    <p>После оплаты и проверки на указанную в настройках вашего профиля email придет письмо
        с информацией по заявке.</p>
    <p>Также вы можете отслеживать статус заявок через раздел <NuxtLink class="text-white" to="/profile">“Мои
            заявки”</NuxtLink>.</p>
    <div class="row gy-3">
        <!-- <div class="col-md-6 col-lg-12">
            <a @click.prevent="() => {show_modal = true}" href="#" class="btn-instruction flex items-center p-2 text-white text-decoration-none h-full">
                <vue-feather type="play-circle"></vue-feather> <span class="font-bold">Смотреть
                    видео-инструкцию</span>
            </a>
        </div> -->
        <div v-if="!button_hide" class="col-md-6 col-lg-12">
            <button @click.prevent="$emit('saveAsDraft')" class="btn btn-warning w-full" :disabled="button_disabled">{{button_text}}</button>
        </div>
    </div>

</div>

<CModal size="lg" alignment="center" :visible="show_modal" @close="() => { show_modal = false}">
    <CModalBody>
        <div class="video-container">
        <iframe :src="'https://www.youtube.com/embed/'+getYoutubeId(getVideoInstructions())" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    </CModalBody>
</CModal>
</template>

<script>
import {
    CModal,
    CModalBody
} from '@coreui/vue';
/*import { useToast } from 'vue-toastification'*/
import { mapGetters } from "vuex"
export default {
    props: {
        button_disabled: {
            type: Boolean,
            default: false,
        },
        button_hide: {
            type: Boolean,
            default: false,
        },
        button_text: {
            type: String,
            default: 'Сохранить как черновик',
        },
    },
    data() {
        return {
            show_modal: false,
        }
    },
    methods: {
        ...mapGetters({
            getVideoInstructions: "formCompetition/getVideoInstructions",
        }),
        getYoutubeId(url) {
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            var match = url.match(regExp);
            return (match && match[7].length == 11) ? match[7] : false;
        },
        showToast(text){
            const toast = useToast()
            toast.info(text);
        }
    },
    props: ['button_disabled', 'button_text', 'button_hide'],
    emits: ['saveAsDraft'],
    components: {
        CModal,
        CModalBody,
    },
}
</script>

<style scoped>
.modal-content {
    border: none;
}

.modal-body {
    padding: 0;
    background: transparent;
    box-shadow: 0 15px 60px rgb(0 0 0 / 50%);
}

.video-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 */
    height: 0;
    background: #000;
}

.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
