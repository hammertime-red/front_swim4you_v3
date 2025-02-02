<template>
<div class="root">
    <div class="main_content dark-mode" :class="globalStore.getBackgroundStatus ? 'blured' : ''">
        <main>
            <slot name="content" />
        </main>

        <!-- <subscribe-section /> -->
        <OfferBlock />
        <Footer />
    </div>
    <slot name="offcanvas" />
    <mobile-menu />
    <OffcanvasSearch />
</div>
</template>

<script>
import OffcanvasSearch from '../components/OffcanvasSearch'
import MobileMenu from '../components/offcanvases/MobileMenu.vue'
import Footer from '../components/footer/Footer.vue'
import OfferBlock from '../components/OfferBlock.vue'
import {useGlobalStore} from '@/store/globalStore'
export default {
    setup() {
        const globalStore = useGlobalStore();
        return {
            globalStore
        };
    },
    components: {
        OffcanvasSearch,
        OfferBlock,
        Footer,
        MobileMenu
    },
}
</script>

<style>
.root_content{
  transition: all .3s ease;
}
main{
    margin-bottom: 60px;
}
</style>
