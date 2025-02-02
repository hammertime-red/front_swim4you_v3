<template>
	<div class="card min-h-full relative overflow-hidden rounded-lg">
		<img :src="event.card_image" class="card__img" />
		<div class="card__overlay"></div>
		<div v-if="dates" class="card__date text-sm flex items-center gap-2">
            <Icon name="ri:calendar-2-line" class="text-sub"/> {{ dates }}
		</div>
		<div class="card__meta">
			<p v-if="event?.competition_name || event?.event_category_name" class="event_card__prefix mb-0">
				{{ event?.competition_name || event?.event_category_name }}
			</p>
			<NuxtLink
				:to="{name: event.type, params: {slug: event.slug}}"
				class="event_card__title card_title_large block text-decoration-none mb-2"
				>{{ event.name }}</NuxtLink
			>
			<div v-if="event.city" class="px-2 py-1 rounded bg-white bg-opacity-50 w-fit text-lg font-bold flex items-center gap-2">
				<Icon name="ri:map-pin-2-line" /> {{ event.city }}
			</div>
			<NuxtLink
				v-if="event.type === 'event' && isRegistrationTime"
				:to="{ name: 'order_event_create', query: { id: event.id} }"
				class="block w-fit btn btn-rounded btn-warning button_16 mt-3">
				Подать заявку
			</NuxtLink>
			<NuxtLink
				v-if="event.type === 'camp' && event.has_active_shifts"
				:to="'/events/' + event.id + '/#camps'"
				class="block w-fit btn btn-rounded btn-warning button_16 mt-3"
				>
                Выбрать смену
            </NuxtLink>
			<NuxtLink
				v-if="event.type === 'master_class'"
				:to="{ name: 'order_master_class_create', query: { id: event.id} }"
				class="block w-fit btn btn-rounded btn-warning button_16 mt-3"
				>
                Подать заявку
            </NuxtLink>
		</div>
		<div class="card__meta__overlay" :style="cardOverlay"></div>
	</div>
</template>

<script setup>
import {computed} from "vue";
import {datesRange, inDateRange} from "@/services/dates";

const props = defineProps({
    event: {
        type: Object,
        required: true,
    }
})

const dates = computed(() => {
    return datesRange(props.event.start_event_date, props.event.end_event_date)
})

const isRegistrationTime = computed(() => {
    if (props.event.type !== 'event') return true
    //console.log(props.event)
    return inDateRange(props.event.start_registration_date, props.event.end_registration_date)
})

const cardOverlay = computed(() => {
    let color = '#030C2F';
    if(props.event.color) color = props.event.color
    return 'background: linear-gradient(to top, '+ color +', transparent);'
})

</script>

<style scoped>
a.disabled {
	opacity: 0.5;
	pointer-events: none;
}
</style>