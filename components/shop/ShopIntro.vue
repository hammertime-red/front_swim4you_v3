<template>
	<section
		class="shop_intro"
		:style="background ? 'background-image: url(' + background + ')' : null">
		<div class="container">
			<div class="row">
				<div class="col-md-6">
					<p v-if="item.prefix" class="title_block opacity-50">{{item.prefix}}</p>
					<h2 v-if="item.title" class="intro_title_medium mb-3">
						{{item.title}}
					</h2>
					<p v-if="item.subtitle" class="intro_subtitle opacity-50 mb-4">
						{{item.subtitle}}
					</p>
					<a v-if="item.link" :href="item.link" class="btn btn-primary btn-rounded btn-primary-shadow">{{item.button_text ? item.button_text : 'Посмотреть'}}</a>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
export default {
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
	computed: {
		background() {
			if (!this.item.background && !this.item.background_mob) return
			if (window.innerWidth < 768) return this.item.background_mob
			return this.item.background
		},
	},
}
</script>

<style scoped>
.shop_intro {
    min-height: 750px;
	background-size: cover;
	background-position: center center;
	background-repeat: no-repeat;
    color: #fff;
    padding: 60px 0;
}

@media (min-width: 768px) {
	.shop_intro .intro_title_medium {
		font-size: 50px;
	}

    .shop_intro{
        display: flex;
        align-items: center;
        min-height: 650px;
    }
}

.shop_intro .btn{
    min-width: 280px;
}

.shop_intro .intro_subtitle{
    max-width: 520px;
}
</style>
