<template>
	<div class="container">
		<template v-for="(item, index) in items" :key="index">
			<div v-show="isYearShow(item)" class="albums_list__year mb-5">
				<h2 class="section_title_medium">{{ item.year }}</h2>
				<div class="row g-4">
					<template v-for="(album, i) in item.items" :key="i">
						<div
							class="col-lg-4 col-md-6">
							<PhtAlbumCard :album="album" />
						</div>
					</template>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
import PhtAlbumCard from '../cards/PhtAlbumCard'
export default {
	components: { PhtAlbumCard },
	props: {
		items: {
			type: Array,
			default: [],
		},
		category: {
			type: String,
			default: null,
		},
	},
	methods: {
		isYearShow(item) {
			return item.items.find((el) => !this.category || el.card_prefix === this.category)
		},
	},
}
</script>

<style></style>
