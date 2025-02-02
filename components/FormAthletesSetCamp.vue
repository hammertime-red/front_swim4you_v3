<template>
	<h2 v-if="title" class="section_title_medium">{{ title }}</h2>
	<p v-if="subtitle" class="text-sub">{{ subtitle }}</p>

	<template v-if="fetched_data">
		<AthletFieldgroup
			v-for="(item, index) in theModel"
			:index="index"
			:key="index"
			:delete_btn="theModel.length > 1 ? true : false"
			:required_documents="required_documents"
			:allowed_distances="allowed_distances"
			:athletes="ATHLETES"
			:allAthletes="ALL_ATHLETES"
			:event_stage_id="event_stage_id"
			:offline_request_text="offline_request_text"
			:used_athletes="selected_athletes"
			:age_limits="age_limits"
			:show_errors="show_errors"
			v-model="theModel[index]"
			v-model:has_errors="has_errors"
			@remove="removeAthleteFieldGroup"
			@addDistance="(id) => $emit('addDistance', id, index, selected_athletes)"
			@setAthlete="selectAthlete" />
	</template>

	<button @click.prevent="addAthletFieldgroup" class="btn btn-secondary">
		<vue-feather type="plus-circle" /> Добавить спортсмена
	</button>
</template>

<script>
import AthletFieldgroup from '~/components/forms/AthletFieldgroup.vue'
import { mapGetters, mapActions } from 'vuex'
import { computed } from 'vue'
export default {
	components: { AthletFieldgroup },
	props: {
		modelValue: {
			type: Object,
			default: () => ({}),
		},
		required_documents: {
			type: Array,
			default: [],
		},
		allowed_distances: {
			type: Array,
			default: [],
		},
		event_stage_id: {
			type: Number,
		},
		offline_request_text: {
			type: String,
		},
		has_errors: {
			type: Boolean,
			default: () => false,
		},
		show_errors: {
			type: Boolean,
			default: () => false,
		},
		title: {
			type: String,
			default: null,
		},
		subtitle: {
			type: String,
			default: null,
		},
		age_limits: {
			type: Array,
			default: [],
		},
	},
	data() {
		return {
			selected_athletes: [],
			used_athletes: [],
			fetched_data: false,
		}
	},
	computed: {
		...mapGetters({
			ATHLETES: 'profile/getAthletes',
			ALL_ATHLETES: 'athletes/getAthletesListNames',
			getAthleteByID: 'athletes/getAthleteByID',
		}),
        athleteIds(){
			return this.theModel.map(item => {
				return item.athlete_id
			})
		}
	},
	async mounted() {
        await this.fetchAthletesByIds(this.athleteIds)
		this.insertAthletesInfo()
		this.fetched_data = true
	},
	methods: {
		...mapActions({
            fetchAthletesByIds: 'athletes/fetchAthletesByIds',
		}),
		insertAthletesInfo() {
			this.theModel.forEach((item) => {
				if (item.athlete_id) {
					item.athlete = this.getAthleteByID(item.athlete_id)
				}
			})
		},
		addAthletFieldgroup() {
			this.theModel.push({
				athlete_id: null,
				online_request: false,
				athlete_documents: [],
			})
		},
		removeAthleteFieldGroup(e) {
			this.theModel.splice(e, 1)
			this.selected_athletes.splice(e, 1)
		},
		selectAthlete(id) {
			this.selected_athletes.push(id)
		},
	},
	setup(props, { emit }) {
		const theModel = computed({
			get: () => props.modelValue,
			set: (value) => emit('update:modelValue', value),
		})
		const has_errors = computed({
			get: () => props.has_errors,
			set: (value) => emit('update:has_errors', value),
		})
		return { theModel, has_errors }
	},
	emits: ['update:theModel', 'update:has_errors', 'addDistance'],
}
</script>

<style></style>