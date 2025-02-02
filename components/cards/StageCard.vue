<template>
    <div class="card card--stage">
        <div class="img_wrapper">
            <img :src="stage.thumbnail" class="card__img" />
        </div>
        <div class="card__overlay"></div>
        <div
            class="
                card__meta
                text-white
                flex
                flex-col
                justify-between
            "
        >
            <div
                v-if="status.text"
                class="badge font-oswald uppercase text-sm"
                :class="status.badge_class"
            >
                {{ status.text }}
            </div>
            <div class="mb-4">
                <NuxtLink
                    :to="'/stage/' + stage.slug"
                    class="
                        card_title_large
                        text-white text-decoration-none
                        block
                        mb-3
                    "
                    >{{ stage.name }}</NuxtLink
                >
                <div class="row gy-3">
                    <div v-if="stage.location_city" class="col-auto">
                        <p class="mb-0 text-sub">Город:</p>
                        <p class="mb-0">{{ stage.location_city }}</p>
                    </div>
                    <div v-if="stage.dates" class="col-auto">
                        <p class="mb-0 text-sub">Даты:</p>
                        <p class="mb-0">{{ stage.dates }}</p>
                    </div>
                    <div
                        v-if="
                            status.dates &&
                            status.name != 'stage_complited' &&
                            status.name != 'stage_now'
                        "
                        class="col-auto"
                    >
                        <p class="mb-0 text-sub">Срок приема заявок:</p>
                        <p class="mb-0">{{ status.dates }}</p>
                    </div>
                </div>
            </div>
            <div v-if="status.name == 'closed'">
                <p class="mb-2 fs-4 font-bold">Регистрация пока закрыта</p>
                <p class="mb-3">
                    Даты начала и окончания регистрации скоро будут
                    опубликованы.
                </p>
            </div>
            <div v-if="status.name == 'registration_closed_now' || status.name == 'registration_open' || status.name == 'event_not_now' && status.time_to">
                <p v-if="status.name == 'registration_closed_now'" class="font-bold mb-2 text-accent">До старта регистрации:</p>
                <p v-if="status.name == 'registration_open'" class="font-bold mb-2">До окончания приема заявок: </p>
                <p v-if="status.name == 'event_not_now'" class="font-bold mb-2">До начала события:</p>
                <div class="row gy-3">
                    <div class="col-auto">
                        <VueCountdown :time="status.time_to" :transform="transformSlotProps" v-slot="{ days, hours, minutes, seconds }" @end="onCountdownEnd">
                        <div class="big_counter flex">
                            <div v-if="days != '00'" class="big_counter__item">
                                <div class="value">{{ days }}</div>
                                <div class="label">Дн.</div>
                            </div>
                            <div v-if="hours != '00'" class="big_counter__item">
                                <div class="value">{{ hours }}</div>
                                <div class="label">Час.</div>
                            </div>
                            <div class="big_counter__item">
                                <div class="value">{{ minutes }}</div>
                                <div class="label">Мин.</div>
                            </div>
                            <div class="big_counter__item">
                                <div class="value">{{ seconds }}</div>
                                <div class="label">Сек.</div>
                            </div>
                        </div>
                        </VueCountdown>
                    </div>
                    <div v-if="status.name == 'registration_open'" class="col-auto">
                        <NuxtLink
                            :to="{ name: 'event_form', query: {id: stage.id, type: 'competition'} }"
                            class="
                                btn btn-primary btn-primary-shadow btn-rounded
                            "
                            >Подать заявку</NuxtLink
                        >
                    </div>
                </div>
            </div>

            <div v-if="status.name == 'stage_complited'">
                <p class="mb-2 fs-4 font-bold text-positive">Этап завершен.</p>
                <template v-if="
                            stage.result_link ||
                            stage.final_protocol_link ||
                            stage.media_photo_id ||
                            stage.media_video_id
                        ">
                    <p class="mb-3">
                        Посмотрите результаты, фото- и видео-альбомы по ссылкам:
                    </p>
                    <div class="media_buttons">
                        <a
                            v-if="stage.result_link"
                            :href="stage.result_link"
                            target="_blank"
                            rel="nofollow"
                            class="btn btn-rounded btn-white btn-sm me-2"
                            ><vue-feather class="text-primary" type="list" />Результаты</a
                        >
                        <a
                            v-if="!stage.result_link && stage.final_protocol_link"
                            :href="stage.final_protocol_link"
                            target="_blank"
                            rel="nofollow"
                            class="btn btn-rounded btn-white btn-sm me-2"
                            ><vue-feather class="text-primary" type="list" />Итоговый протокол</a
                        >
                        <NuxtLink
                            v-if="stage.media_photo_id"
                            :to="'/media/' + stage.media_photo_id"
                            class="btn btn-rounded btn-white btn-sm me-2"
                            ><vue-feather class="text-primary" type="image" />Фото</NuxtLink
                        >
                        <NuxtLink
                            v-if="stage.media_video_id"
                            :to="'/media/' + stage.media_video_id"
                            class="btn btn-rounded btn-white btn-sm"
                            ><vue-feather class="text-primary" type="play" />Видео</NuxtLink
                        >
                    </div>
                </template>
                
                <p v-else class="mb-3">
                    Скоро будут опубликованы результаты, фото- и видео-альбомы
                </p>
                
            </div>
        </div>
        <div class="card__meta__overlay"></div>
    </div>
</template>

<script>
import moment from 'moment-timezone'
//import moment from "moment";
import VueCountdown from '@chenfengyuan/vue-countdown';
import { mapGetters } from 'vuex';
export default {
    components: {VueCountdown},
    props: ["stage"],
    data() {
        return {
            status: {
                name: "closed",
                text: "",
                dates: null,
                time_to: null,
                badge_class: "bg-warning text-dark",
            },
        };
    },
    mounted() {
        this.getStatus();
    },
    methods: {
        transformSlotProps(props) {
            const formattedProps = {};

            Object.entries(props).forEach(([key, value]) => {
                formattedProps[key] = value < 10 ? `0${value}` : String(value);
            });

            return formattedProps;
        },
        onCountdownEnd: function () {
            this.getStatus();
        },
        /* isRegistrationTime() {
			if (this.event.type !== 'competition') return true
			if (!this.event.start_registration_date || !this.event.end_registration_date)
				return false
			let tz = moment.tz.guess();
			let now = moment.tz(tz)
			let offset = now._offset - moment.tz('Europe/Moscow')._offset
			let start = moment(this.event.start_registration_date, 'DD-MM-YYYY HH:mm').add(offset, 'minutes');
			let end = moment(this.event.end_registration_date, 'DD-MM-YYYY HH:mm').add(offset, 'minutes');
			
			if (start < now && now < end) return true
			return
		}, */
        getStatus() {
            let start_registration = null;
            let end_registration = null;
            let start_event = null;
            let end_event = null;

            if (
                this.stage.start_registration_date &&
                this.stage.end_registration_date
            ) {
                start_registration = moment.tz(
                    this.stage.start_registration_date,
                    "DD-MM-YYYY hh:mm", 'Europe/Moscow'
                );
                end_registration = moment.tz(
                    this.stage.end_registration_date,
                    "DD-MM-YYYY hh:mm", 'Europe/Moscow'
                );
                this.status.dates =
                    start_registration.format("DD.MM.YYYY") +
                    " - " +
                    end_registration.format("DD.MM.YYYY");
            } else {
                this.status.text = "Прием заявок пока закрыт";
                return;
            }

            if (this.CURRENT_TIME < end_registration) {
                if (this.CURRENT_TIME < start_registration) {
                    this.status.text = "Прием заявок пока закрыт";
                    this.status.time_to = start_registration - this.CURRENT_TIME;
                    this.status.name = "registration_closed_now";
                    return;
                }
                this.status.text = "Прием заявок уже идет";
                this.status.time_to = end_registration - this.CURRENT_TIME;
                this.status.name = "registration_open";
                this.status.badge_class = "bg-positive";
                return;
            }

            if (this.stage.start_event_date && this.stage.end_event_date) {
                start_event = moment(
                    this.stage.start_event_date,
                    "DD-MM-YYYY hh:mm"
                );
                end_event = moment(
                    this.stage.end_event_date,
                    "DD-MM-YYYY hh:mm"
                );
                this.status.dates =
                    start_event.format("DD.MM.YYYY") +
                    " - " +
                    end_event.format("DD.MM.YYYY");
            } else {
                this.status.text = "Прием заявок окончен";
                this.status.name = "registration_end";
                this.status.badge_class = "bg-destructive";
                return;
            }

            if (this.CURRENT_TIME < end_event) {
                if (this.CURRENT_TIME < start_event) {
                    this.status.text = "Прием заявок окончен";
                    this.status.time_to = start_event - this.CURRENT_TIME;
                    this.status.name = "event_not_now";
                    this.status.badge_class = "bg-destructive";
                    return;
                }
                this.status.text = "Этап уже идет";
                this.status.name = "stage_now";
                this.status.time_to = end_event - this.CURRENT_TIME;
                this.status.badge_class = "bg-positive";
                return;
            }

            this.status.text = "Этап завершен";
            this.status.name = "stage_complited";
            this.status.badge_class = "bg-destructive";
            return;
        },
    },
    computed: {
        ...mapGetters({
            CURRENT_TIME: 'events/CURRENT_TIME'
        })
    },
};
</script>

<style>
</style>