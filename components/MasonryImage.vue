<template>
	<div class="media_item">
        <!-- <div class="img_skeleton" v-if="!loaded_item"></div> -->
		<img
			:src="item?.thumb ? item.thumb : item.img"
			:class="{
                loaded_item: loaded_item
            }"
			loading="lazy"
			@load="loaded_item = true" />

            <!-- <VueLoadImage class="media_item__image_cont">
                <template v-slot:image>
                    <img :src="item.img" />
                </template>
                <template v-slot:preloader>
                    <div class="img_skeleton"></div>
                </template>
                <template v-slot:error>
                    <div>error message</div>
                </template>
            </VueLoadImage> -->

		<span v-if="item.youtube" class="media_badge">
			<vue-feather type="youtube" size="16"></vue-feather>
		</span>
		<div class="media_item__overflow">
			<vue-feather :type="item.youtube ? 'youtube' : 'zoom-in'" size="36" />
		</div>
	</div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object
        },
        loaded: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            loaded_item: false
        }
    },
    components: {
    }
}
</script>

<style>
.img_skeleton{
    background: #ccc;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}

.media_item {
    max-width: 600px;
	overflow: hidden;
	cursor: pointer;
	position: relative;
    min-height: 200px;
}

@media(max-width: 768px){
    .media_item {
        min-height: 100px;
    }
}

.media_item img {
	transition: all 0.4s;
    transform: scale(1);
}

.media_item img:not(.loaded_item) {
    opacity: 0;
	z-index: -1;
}

.media_item:hover img {
	transform: scale(1.05);
}

.media_item__overflow {
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

.media_item:hover .media_item__overflow {
	opacity: 1;
}

.media_item .media_badge {
	position: absolute;
	top: 50%;
	left: 15px;
	transform: translateY(-50%);
}

.media_item:hover .media_badge {
	display: none;
}

.media_item .media_badge svg {
	height: 16px;
	width: 16px;
}
</style>
