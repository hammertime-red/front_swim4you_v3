<template>
	<div
		ref="offer_block"
		v-if="
			globalStore.getOfferBlock &&
			globalStore.getOfferBlock?.enable_offer != '0' &&
			globalStore.getOfferBlock?.background_img &&
			globalStore.getOfferBlock?.title
		"
		class="container">
		<div
			class="subcribe_section"
			:style="'background-image: url(' + globalStore.getOfferBlock?.background_img + ');'">
			<div class="overlay"></div>
			<div class="subcribe_section__content">
				<p class="title">{{ globalStore.getOfferBlock.title }}</p>
				<p v-if="globalStore.getOfferBlock?.subtitle" class="subtitle lead">
					{{ globalStore.getOfferBlock.subtitle }}
				</p>
				<template v-if="globalStore.getOfferBlock?.btn_text && globalStore.getOfferBlock?.btn_link">
					<NuxtLink
						v-if="buttonType == 'route'"
						:to="globalStore.getOfferBlock.btn_link"
						class="btn btn-warning px-5 mt-4">
						{{ globalStore.getOfferBlock.btn_text }}
					</NuxtLink>
					<a
						v-else
						:href="globalStore.getOfferBlock.btn_link"
						class="btn btn-warning px-5 mt-4"
						target="_blank"
						>{{ globalStore.getOfferBlock.btn_text }}</a>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import {useGlobalStore} from '@/store/globalStore'
export default {
	updated() {
		if (this.blockHeight) {
        this.globalStore.setFooterTopPadding(this.blockHeight / 2)
		}
	},
    setup() {
        const globalStore = useGlobalStore();
        return {
            globalStore
        };
    },
	computed: {
		buttonType() {
			if (!this.globalStore.getOfferBlock) return
			if (!this.globalStore.getOfferBlock?.btn_link || this.globalStore.getOfferBlock.btn_link.includes('http'))
				return 'link'
			return 'route'
		},
		blockHeight() {
			if (!this.$refs.offer_block) return 0
			return this.$refs.offer_block.clientHeight
		},
	},
}
</script>

<style>
.subcribe_section .overlay {
	position: absolute;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	background: rgba(0, 31, 141, 0.7);
}

.subcribe_section__content{
    position: relative;
}
</style>
