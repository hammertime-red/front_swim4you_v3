<template>
	<NuxtLink :to="{ name: 'photobank_album', params: { id: album.id }}" class="card event_card">
		<img :src="album.thumbnail" class="card__img" />
		<div v-if="album.date" class="card__date text-sm">
			<vue-feather type="calendar"></vue-feather> {{ album.date }}
		</div>
		<div class="card__meta rounded p-3">
			<p v-if="album.card_prefix" class="event_card__prefix mb-0">
				{{ album.card_prefix }}
			</p>
			<h3 class="event_card__title card_title_large block text-decoration-none mb-3">{{ album.name }}</h3>
            <div class="card__meta__bottom flex justify-between">
                <div v-if="album.city" class="event_card__location text-sub">
                    <vue-feather type="map-pin" class="me-1"></vue-feather>{{ album.city }}
                </div>
                <div v-if="album.img_count" class="event_card__imgcount text-sub">
                    <vue-feather type="camera" size="16" class="me-1"></vue-feather>{{ album.img_count }}
                </div>
            </div>
		</div>
	</NuxtLink>
</template>

<script>
export default {
	props: ['album'],
	computed: {
	},
}
</script>

<style scoped>
    .card__date{
        color: #071031;
    }

    .card__meta{
        background: rgba(7, 16, 49, 0.65);
        backdrop-filter: blur(10px);
        left: 15px;
        right: 15px;
        bottom: 15px;
    }

    .event_card__prefix{
        font-size: 16px;
    }

    .event_card__title{
        font-size: 24px;
    }

    .event_card__location{
        background: rgba(0, 0, 0, 0.4);
        font-size: 16px;
    }
    
</style>