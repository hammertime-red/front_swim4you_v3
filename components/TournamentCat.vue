<template>
	<div class="event_results_links content_box mb-3">
		<div class="tournament_item__header p-4">
			<div class="row g-4">
				<div class="col-lg-9 flex items-center">
					<img
						v-if="item.icon"
						:src="item.icon"
						class="championship__logo me-2" />
					<div>
						<p class="text-sub text-sm mb-0">{{ item.event_name }}</p>
						<p class="font-bold text_20 mb-1">{{ itemName }}</p>
					</div>
				</div>
				<div class="col-lg-3 flex justify-content-lg-end items-center">
					<div class="row g-2">
						<div class="col-md-auto">
							<a
								v-if="!is_loading"
								@click.prevent="toggleExpand()"
								href="#"
								class="btn btn-outline btn-outline-secondary btn-rounded btn-sm w-full w-md-auto">
								<vue-feather
									:type="is_expanded == false ? 'chevron-down' : 'chevron-up'"
									class="text-secondary" />
								{{ is_expanded == false ? 'Развернуть' : 'Свернуть' }}
							</a>
							<vue-feather v-else class="mx-auto text-primary" type="loader" animation="spin" animation-speed="slow"></vue-feather>
						</div>
					</div>
				</div>
			</div>
		</div>
		<transition name="slide">
			<div v-if="is_expanded" class="tournament_item__table pb-2">
				<TournamentTable :data="items" :show_summ="item.show_summ" filterClass="rounded-0" :altFilters="true" />
				<!-- <TournamentTableRelays v-if="item.distance_type === 'relay'" :data="items" filterClass="rounded-0" :altFilters="true" /> -->
			</div>
		</transition>
	</div>
</template>

<script>
/* import TournamentTableRelays from './table/TournamentTableRelays.vue' */
import TournamentTable from './table/TournamentTable'
import axios from 'axios'
export default {
	props: ['item'],
	data() {
		return {
			items: [],
			loaded_data: false,
			is_expanded: false,
			is_loading: false,
		}
	},
	computed: {
		itemName() {
			let name = ''
			if (this.item.distance_type === 'relay') {
				name += 'Командный зачет – '
			}
			name +=
				this.item.tournament_title

			return name
		},
	},
	methods: {
		async toggleExpand(){
			if(this.is_expanded) { 
				this.is_expanded = false
			} 
			else {
				if(!this.loaded_data){
					await this.fetchTournament()
				}
				this.is_expanded = true
			}
		},
		async fetchTournament(){
			this.is_loading = true
            try{
                const response = await axios.get(process.env.VUE_APP_BASE_URL+'results/tournaments/'+this.item.id+'/results' /*, {params: {
					event: this.item.event_id,
					distance_type: this.item.distance_type,
					gender_strict: this.item.gender,
					agemin: this.item.agemin,
					agemax: this.item.agemax,
					stroke: this.item.stroke,
			}} */)
                if(response.data){
                    this.items = response.data
					this.loaded_data = true
                }
            } catch (e){
                console.log(e.response);
                alert("Ошибка получения данных с сервера о результатах'")
            }
			this.is_loading = false
        },
	},
	components: { 
		TournamentTable,
        /* TournamentTableRelays  */
	},
}
</script>

<style></style>
