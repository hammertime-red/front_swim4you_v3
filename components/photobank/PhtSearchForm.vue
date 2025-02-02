<template>
	<div class="phtsearchform__wrap flex flex-col flex-lg-row rounded mb-2 p-3">
		<div class="phtsearchform flex flex-col flex-md-row me-0 me-lg-4 mb-4 mb-lg-0">
			<input
				v-model="search_phrase"
				type="text"
				class="form-control rounded ps-sm-3 pe-sm-5 mt-0 mb-2 mb-lg-0"
				placeholder="Введите название события или ФИО спортсмена" />
			<button @click="goToSearch()" class="btn btn-primary btn-primary-shadow rounded" :disabled="!search_phrase">
				<vue-feather type="search" />
			</button>
		</div>
		<button v-if="USERDATA && ATHLETE_NAMES" @click="showPhotosByAthletes()" class="btn btn-primary btn-primary-shadow uppercase rounded">
			Найти фото с моими атлетами
		</button>
	</div>
	<div class="phtsearchform__tips">
        <template v-for="item in TIPS" :key="item.id">
		<NuxtLink
			v-if="!$route.params.id && item.id != $route.params.id"
			:to="{ name: 'photobank_album', params: { id: item.id } }"
			class="phtsearchform__tip text-sub text-sm p-1 rounded-3 me-2 mb-2 text-decoration-none">
			<vue-feather type="search" size="14" />
			{{ item.name }}
		</NuxtLink>
        </template>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
	data() {
		return {
			search_phrase: '',
		}
	},
	computed: {
		...mapGetters({
			TIPS: 'photobank/getSearchTips',
			USERDATA: 'profile/getUserData',
			ATHLETE_NAMES: 'profile/getAthleteNames',
		}),
	},
	mounted() {
		this.fetchSearchTips()
		this.fetchAthleteNames()
		if(this.$route.query.s){
			this.search_phrase = this.$route.query.s
		}
	},
	methods: {
		...mapActions({
			fetchSearchTips: 'photobank/fetchSearchTips',
			fetchAthleteNames: 'profile/fetchAthleteNames'
		}),
        goToSearch(){
            if(this.search_phrase){
                this.$router.push({ name: 'photobank_search', query: { s: this.search_phrase } })
            }
        },
		showPhotosByAthletes(){
			this.$router.push({name: 'photobank_search', query: {s: this.ATHLETE_NAMES}})
		}
	},
}
</script>

<style scoped>
.phtsearchform__wrap {
	background: rgba(0, 0, 0, 0.35);
}

.phtsearchform {
	flex-grow: 2;
	position: relative;
}

.phtsearchform input {
	height: 56px;
	font-size: 18px;
}

@media (min-width: 768px) {
	.phtsearchform button {
		position: absolute;
		right: 4px;
		top: 4px;
		height: 48px;
		width: 52px;
		padding: 0;
	}
}

.phtsearchform button i {
	width: 28px;
	height: 28px;
}

@media (max-width: 768px) {
	.phtsearchform input {
		font-size: 16px;
	}

	.phtsearchform button i {
		width: 24px;
		height: 24px;
	}
}

.phtsearchform__tip {
	background: rgba(0, 0, 0, 0.35);
	border: none;
	transition: color 0.3s;
}

.phtsearchform__tip:hover {
	color: #fff !important;
}
</style>
