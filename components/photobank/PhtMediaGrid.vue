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
		:key="grid.component_key"
        :useResizeObserver="true"
        :observeChildren="true"
        >
		<div
			v-for="(item, i) in items"
			:key="i"
			class="pht_media_item"
            data-grid-lazy="true">
			<PhtPhotoCard
                :item="item"
				:src="item.thumb ?? item.src"
				:download_src="item.src ? item.src : null"
				:price="item.price"
				:style="loaded ? 'opacity: 1;' : 'opacity: 0;'" 
                :view_image="true"
                :type="type"
                @download="downloadPhoto(item.id)"
                @viewImage="
				() => {
					;(show_modal = true), (image_index = parseInt(i))
				}"
                @showMorePhotos="showMorePhotos()"
                />
		</div>
	</JustifiedGrid>

	<CModal
		size="lg"
		alignment="center"
		:visible="show_modal"
		@close="
			() => {
				show_modal = false
			}
		"
		@show="thisSlider(), swiperTo()">
		<div class="carousel-nav animated fadeInDown">
			<button class="carousel-control-prev me-3" type="button" @click="swiperPrev()">
				<vue-feather type="arrow-left-circle"></vue-feather>
			</button>
			<button class="carousel-control-next" type="button" @click="swiperNext()">
				<vue-feather type="arrow-right-circle"></vue-feather>
			</button>
		</div>
		<CModalBody>
			<Swiper
				:spaceBetween="10"
				:autoHeight="true"
				:effect="'fade'"
				:modules="modules"
				ref="swiper_slider">
				<SwiperSlide v-for="(item, i) in items" :key="i">
					<PhtPhotoCard
                        :item="item"
                        :src="item.large ?? item.src"
                        :price="item.price"
						:download_src="item.src ? item.src : null"
                        :view_image="false"
                        :type="type"
                        @addToCart="addToCart(item.id)"
                        @removeFromCart="removeFromCart(item.id)"
                    />
				</SwiperSlide>
			</Swiper>
		</CModalBody>
	</CModal>
</template>

<script>
import PhtPhotoCard from '../cards/PhtPhotoCard'
import { JustifiedGrid } from '@egjs/vue-grid'
import { CModal, CModalBody } from '@coreui/vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
export default {
	components: {
		PhtPhotoCard,
		JustifiedGrid,
		CModal,
		CModalBody,
		Swiper,
		SwiperSlide,
	},
	props: ['items', 'type', 'search'],
	data: () => ({
		show_modal: false,
		image_index: 0,
		swiper: null,
		grid: {
			component_key: 0,
			gap: 5,
			defaultDirection: 'end',
			columnRange: [1, 3],
			rowRange: 0,
			sizeRange: [200, 600],
			isCroppedSize: false,
			displayedRow: -1,
		},
		loaded: false,
	}),
	setup() {
		return {
			modules: [EffectFade],
		}
	},
	mounted() {
		this.changeGalleryColumns()
		this.setLoaded()
	},
    updated(){
        this.reinitGrid()
    },
	methods: {
        reinitGrid(){
            const grid = this.$refs.grid;
            grid.syncElements();
        },
        addToCart(id){
            console.log('addToCart', id);
        },
        showMorePhotos(){
            this.$router.push({name: 'photobank_search', query: {s: this.search}})
        },
        removeFromCart(id){
            console.log('removeFromCart', id);
        },
        downloadPhoto(id){
            console.log('downloadPhoto', id);
        },
		changeGalleryColumns() {
			if (window.innerWidth < 768) {
				this.grid.columnRange = 1
			}
		},
		thisSlider() {
			this.swiper = this.$refs.swiper_slider.$el.swiper
		},
		swiperPrev() {
			this.swiper.slidePrev()
		},
		swiperNext() {
			this.swiper.slideNext()
		},
		swiperTo() {
			this.swiper.slideTo(this.image_index)
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

.carousel-nav {
	position: fixed;
	top: 50%;
	left: 15px;
	right: 15px;
	transform: translateY(-50%);
	justify-content: space-between;
}

@media screen and (max-width: 768px) {
	.carousel-nav {
		position: absolute;
		top: auto;
		bottom: -70px;
		left: 0;
		right: 0;
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

.pht_media_item {
	overflow: hidden;
	position: relative;
}

.pht_media_item img {
	transition: all 0.4s;
}

.pht_media_item:hover img {
	transform: scale(1.05);
}

.pht_media_item__overflow {
	opacity: 0;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(7, 16, 49, 50%);
	display: flex;
	align-items: center;
	justify-content: center;
	transition: opacity 0.4s;
	color: #fff;
}

.pht_media_item:hover .pht_media_item__overflow {
	opacity: 1;
}

.media_badge {
	position: absolute;
	top: 50%;
	left: 15px;
	transform: translateY(-50%);
}

.pht_media_item:hover .media_badge {
	display: none;
}

.media_badge svg {
	height: 16px;
	width: 16px;
}
</style>
