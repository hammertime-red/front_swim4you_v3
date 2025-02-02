<template>
    <div class="steps">
        <div class="row g-5">
            <div v-for="(item, i) in items" :key="i" class="steps__item__col col-md-3">
                <div class="steps__item">
                    <span class="count text-accent">{{i}}</span>
                    <p class="content text-white">{{item.text}}</p>
                </div>
                <div class="steps__line"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['items']
};
</script>

<style>
</style>