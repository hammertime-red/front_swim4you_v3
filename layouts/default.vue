<script setup lang="ts">
import Footer from "~/components/footer/Footer.vue";
import Header from "~/components/header/Header.vue";
import OfferBlock from "~/components/OfferBlock.vue";

const globalStore = useGlobalStore()
</script>

<template>
    <div class="main_content" :class="globalStore.getBackgroundStatus ? 'blured' : ''">
        <Header />
        <main>
            <NuxtPage />
        </main>

        <!-- <SubscribeSection /> -->
        <OfferBlock />
        <Footer />
    </div>
</template>

<style scoped>

</style>