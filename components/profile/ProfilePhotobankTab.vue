<template>
	<div class="mb-5">
		<PhtMediaGrid :items="paginatedImages" type="download" />
		<div v-if="!PHOTOS.length && loaded" class="no_photos text-center">
			<div v-if="!hasContent" class="table__no_content text-center fs-3 py-3 text-sub">
				<img src="/img/table_no_content.svg" style="max-width: 430px;">
				<div>У вас пока нет фото с соревнований</div>
				<NuxtLink :to="{name: 'photobank'}" class="btn btn-primary btn-primary-shadow rounded-pill mx-auto my-4">Найти фото</NuxtLink>
			</div>
		</div>

		<button
			v-if="showImages < PHOTOS.length"
			@click="showImages += limit"
			class="show_more block btn btn-primary btn-primary-shadow rounded-pill mx-auto my-4">
			Показать еще
		</button>
	</div>

	<!-- <template v-if="PHOTOS_BY_ATHLETES.items.length">
		<hr class="w-full mb-5" />
		<h2 class="section_title_medium uppercase mb-3">Рекомендуемые фото</h2>
		<PhtMediaGrid
			:items="PHOTOS_BY_ATHLETES.items"
			:search="PHOTOS_BY_ATHLETES.search"
			type="show_more" />
	</template> -->

	

	
</template>

<script>
import PhtMediaGrid from '../photobank/PhtMediaGrid.vue'
export default {
	components: {
		PhtMediaGrid,
	},
	data() {
		return {
			limit: 20,
			showImages: 20,
			loaded: false,
		}
	},
	computed: {
		paginatedImages() {
			return this.PHOTOS.slice(0, this.showImages)
		},
		PHOTOS() {
			return this.$store.getters['photobank/getPayedPhotos']
		},
		PHOTOS_BY_ATHLETES() {
			return this.$store.getters['photobank/getPhotosByAthletes']
		},
	},
	async mounted() {
		let order_id = this.$route.query.order_id ? this.$route.query.order_id : null
		await this.$store.dispatch('photobank/fetchPayedPhotos', order_id)
		await this.$store.dispatch('photobank/fetchPhotosByAthletes')
		setTimeout(() => {
			this.loaded = true
		}, 1000);
	},
	methods: {},
}
</script>

<style></style>
