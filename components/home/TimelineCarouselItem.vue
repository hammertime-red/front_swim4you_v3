<template>
  <div class="timeline_carousel__item">
        <div class="timeline_carousel__place mb-4">
            <p v-if="post.date" class="text-sub mb-0">{{post.date}}</p>
            <p v-if="post.city" class="font-bold">{{post.city}}</p>
        </div>
        <div class="timeline_carousel__pin_cont">
            <NuxtLink :to="{name: 'event', params: {slug: post.slug}}" class="timeline_carousel__pin flex items-center justify-center">
                <Icon name="ri:link" size="20px" />
            </NuxtLink>
        </div>

        <NuxtLink v-if="post.name" :to="{name: 'event', params: {slug: post.slug}}" class="timeline_carousel__title title_bold_24 block text-decoration-none mb-1">{{post.name}}</NuxtLink>
        <p v-if="post.dates" class="text-sub">{{post.dates}}</p>
    </div>
</template>

<script>
export default {
    props: ['post']
}
</script>

<style>

</style>