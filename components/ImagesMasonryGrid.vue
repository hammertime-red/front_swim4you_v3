<template>
	<JustifiedGrid
		ref="grid"
		:gap="grid.gap"
		:defaultDirection="grid.defaultDirection"
		:columnRange="grid.columnRange"
		:rowRange="grid.rowRange"
		:sizeRange="grid.sizeRange"
		:isCroppedSize="grid.isCroppedSize"
		:displayedRow="grid.displayedRow"
		:useResizeObserver="true"
		:observeChildren="true"
		@renderComplete="renderComplete">
        <MasonryImage
            v-for="(item, i) in paginatedImages"
			:key="i"
			@click="
				() => {
					image_index = parseInt(i)
					show_modal = true
				}
			"
            :item="item"
            :loaded="loaded"
            />
	</JustifiedGrid>

	<button
		v-if="showImages < items.length"
		@click="showImages += limit"
		class="show_more block btn btn-primary btn-primary-shadow rounded-pill mx-auto my-4">
		Показать еще
	</button>
	<GDialog 
		ref="g_dialog"
		v-model="show_modal"
		depressed
        height="100%"
	>
		<div class="relative" @click.prevent.stop="show_modal = false" style="max-height: 100%;">
			<Swiper
				:spaceBetween="10"
				:autoHeight="true"
				:effect="'fade'"
				:modules="modules"
                :lazy="true"
				:keyboard="{
					enabled: true,
					onlyInViewport: false,
				}"
				ref="swiper_slider"
                style="height: 100% !important;">
				<SwiperSlide v-for="(item, i) in paginatedImages" :key="i" class="flex justify-center">
					<div v-if="item.youtube" class="video-container">
						<iframe
							:src="'https://www.youtube.com/embed/' + item.youtube"
							frameborder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowfullscreen></iframe>
					</div>
                    <div v-else class="image_wrapper">
                        <img :src="item.img" style="height: auto; width: auto; max-width: 100%; max-height: calc(100vh - 120px); object-fit: contain; margin: 0 auto;" @click.prevent.stop />
                    </div>
				</SwiperSlide>
			</Swiper>
			<div class="carousel-nav animated fadeInDown">
				<button
					class="carousel-control-prev me-3"
					type="button"
					@click.prevent.stop="swiperPrev()"
					:style="'visibility:' + minSlides">
					<vue-feather type="arrow-left-circle"></vue-feather>
				</button>
				<button
					class="carousel-control-next"
					type="button"
					@click.prevent.stop="swiperNext()"
					:style="'visibility:' + maxSlides">
					<vue-feather type="arrow-right-circle"></vue-feather>
				</button>
			</div>
		</div>
	</GDialog>
</template>

<script>
import MasonryImage from './MasonryImage.vue'
import { JustifiedGrid } from '@egjs/vue-grid'
//import { CModal, CModalBody } from '@coreui/vue'
//import 'gitart-vue-dialog/dist/style.css'
//import { GDialog } from 'gitart-vue-dialog'
import { Keyboard, EffectFade } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/keyboard'

export default {
	props: ['items'],
	data: () => ({
		show_modal: false,
		image_index: 0,
		swiper: null,
		showImages: 10,
		limit: 10,
		grid: {
			gap: 5,
			defaultDirection: 'end',
			columnRange: [1, 4],
			rowRange: 0,
			sizeRange: [200, 600],
			isCroppedSize: false,
			displayedRow: -1,
		},
		loaded: false,
	}),
	setup() {
		return {
			modules: [EffectFade, Keyboard],
		}
	},
	mounted() {
		this.changeGalleryColumns()
	},
	updated() {
		this.reinitGrid()
	},
	computed: {
		paginatedImages() {
			return this.items.slice(0, this.showImages)
		},
		maxSlides() {
			if (this.swiper) {
				if (this.swiper.activeIndex + 1 >= this.swiper.imagesLoaded) {
					return 'hidden'
				}
			}
			return 'visible'
		},
		minSlides() {
			if (this.swiper) {
				if (this.swiper.activeIndex == 0) {
					return 'hidden'
				}
			}
			return 'visible'
		},
	},
	watch: {
		show_modal: {
			async handler(val){
				if(val){
					if(!this.$refs.swiper_slider){
						await this.thisSlider()
					}
					this.swiperTo()
					this.timeout(100)
				}
			},
		},
	},
	methods: {
        Clog(message){
            console.log(message);
        },
		renderComplete() {
			this.setLoaded()
		},
		reinitGrid() {
			const grid = this.$refs.grid
			grid.syncElements()
		},
		changeGalleryColumns() {
			if (window.innerWidth < 768) {
				this.grid.columnRange = 2
			}
		},
		async thisSlider() {
			await this.timeout(100);
			this.swiper = this.$refs.swiper_slider.$el.swiper
		},
		timeout(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		},
		swiperPrev() {
			this.swiper.slidePrev()
		},
		swiperNext() {
			this.swiper.slideNext()
		},
		swiperTo(index) {
			this.swiper.slideTo(index ? index : this.image_index)
		},
		getYoutubeId(url) {
			var regExp =
				/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
			var match = url.match(regExp)
			return match && match[7].length == 11 ? match[7] : false
		},
		setLoaded() {
			setTimeout(() => (this.loaded = true), 1000)
		},
	},
    components: {
		JustifiedGrid,
		Swiper,
		SwiperSlide,
		GDialog,
        MasonryImage
	},
}
</script>

<style scoped>
.swiper-slide{
    opacity: 0 !important;
}

.swiper-slide-active{
    opacity: 1 !important;
}
.modal-content {
	border: none;
}

.modal-body {
	padding: 0;
	background: transparent;
	box-shadow: 0 15px 60px rgb(0 0 0 / 50%);
}

.carousel-nav {
	position: fixed;
	top: 50%;
	left: 15px;
	right: 15px;
	transform: translateY(-50%);
	justify-content: space-between;
}

@media screen and (max-width: 768px) {
	/* .carousel-nav {
		position: absolute;
		top: auto;
		bottom: -70px;
		left: 0;
		right: 0;
	} */
	.carousel-nav {
		position: relative;
		top: auto;
		left: auto;
		right: auto;
		margin-top: 10px;
	}
}

.carousel-nav button {
	color: #fff;
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
