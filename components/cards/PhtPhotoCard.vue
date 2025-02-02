<template>
	<div v-if="src" class="photo_card">
		<img :src="src" />
		<div class="overflow">
			<div
				class="photo_card__buttons flex flex-wrap items-center justify-content-end">
				<template v-if="type == 'buy'">
					<p v-if="price" class="font-bold me-2 mb-0 text-white mt-2">{{ price }} ₽</p>
					<div class="flex mt-2">
						<button
							v-if="!isSold && inCart"
							@click="removeFromCart(item.id)"
							class="btn btn-sm btn-success rounded-pill uppercase me-2">
							<vue-feather type="shopping-cart" size="17" class="me-2" />
							<span class="small">В корзине</span>
						</button>

						<div
							v-if="isSold"
							class="btn btn-sm btn-success rounded-pill uppercase me-2">
							<vue-feather type="check-circle" size="17" class="me-2" />
							<span class="small">Куплено</span>
						</div>

						<button
							v-if="!isSold && !inCart"
							@click="addToCart(item.id)"
							class="btn btn-sm btn-primary rounded-pill uppercase me-2">
							<vue-feather type="shopping-cart" size="17" class="me-2" />
							<span class="small">В корзину</span>
						</button>

						<button
							v-if="view_image"
							@click="$emit('viewImage')"
							class="btn btn-sm btn-circle flex-shrink-0">
							<vue-feather type="eye" size="17" />
						</button>
					</div>
				</template>

				<template v-if="type == 'download'">
					<button
						@click="downloadPhoto(download_src, item.id)"
						class="btn btn-sm btn-primary rounded-pill uppercase me-2">
						<vue-feather type="download" size="17" class="me-2" />
						<span class="small">Скачать</span>
					</button>
					<button
						v-if="view_image"
						@click="$emit('viewImage')"
						class="btn btn-sm btn-circle flex-shrink-0">
						<vue-feather type="eye" size="17" />
					</button>
				</template>

				<template v-if="type == 'show_more'">
					<div class="flex flex-wrap items-center justify-between w-full">
						<p class="photo_card__tags text-sub text-sm mb-0 mt-2">
							{{item.tags}}
						</p>
						<div class="flex mt-2">
							<button
								@click="$emit('showMorePhotos')"
								class="btn btn-sm btn-primary rounded-pill uppercase ms-2 me-2 flex-shrink-0">
								<span class="small">Смотреть все</span>
							</button>
							<button
								v-if="view_image"
								@click="$emit('viewImage')"
								class="btn btn-sm btn-circle flex-shrink-0">
								<vue-feather type="eye" size="17" />
							</button>
						</div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios"
export default {
	props: {
		item: {
			type: Object,
		},
		src: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
		},
		status: {
			type: String,
			default: null,
		},
		view_image: {
			type: Boolean,
		},
		type: {
			type: String,
			default: 'buy',
		},
		download_src: {
			type: String,
			default: null
		},
	},
	computed: {
		isSold(){
			return this.$store.getters['photobank/getPayedPhotosIds'].includes(this.item.id)
		},
		inCart() {
			return this.$store.getters['photobank/getCart'].includes(this.item.id)
		},
	},
	methods: {
		addToCart(id) {
			this.$store.commit('photobank/addToCart', id)
		},
		removeFromCart(id) {
			this.$store.commit('photobank/removeFromCart', id)
		},
		forceFileDownload(response, title) {
			const url = window.URL.createObjectURL(new Blob([response.data]))
			const link = document.createElement('a')
			link.href = url
			link.setAttribute('download', title + '.jpg')
			document.body.appendChild(link)
			link.click()
		},
		downloadPhoto(url, title){
			axios({
				method: 'get',
				url,
				responseType: 'arraybuffer',
			})
			.then((response) => {
				this.forceFileDownload(response, title)
			})
			.catch((e) => console.log(e))
		}
	},
	emits: ['viewImage', 'downloadPhoto', 'showMorePhotos'],
}
</script>

<style scoped>
.photo_card {
	overflow: hidden;
	position: relative;
}

.photo_card img {
	transition: all 0.4s;
}

.photo_card:hover img {
	transform: scale(1.05);
}

.overflow {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 50%;
	background: linear-gradient(to top, #03091d, transparent);
}

.photo_card__buttons {
	position: absolute;
	bottom: 10px;
	right: 10px;
	left: 10px;
	width: calc(100% - 20px);
}

.btn-circle {
	background: #fff;
	width: 45px;
	height: 45px;
}

.btn-circle i {
	color: #0d6efd;
	transition: all 0.2s;
}

.btn-circle:hover {
	color: #fff;
	background: #0d6efd;
}

.btn-circle:hover i {
	color: #fff;
}

.photo_card__tags {
	max-width: 200px;
}
</style>
