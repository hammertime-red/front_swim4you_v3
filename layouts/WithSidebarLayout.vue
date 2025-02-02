<template>
<div class="root">
    <div class="main_content" :class="globalStore.getBackgroundStatus ? 'blured' : ''">
        <main>
            <slot name="head" />
            <div class="page_section container">
                <div class="row g-5 flex-lg-row" :class="noreverse ? '' : 'flex-col-reverse'">
                    <div class="col-lg-9">
                        <slot name="content" />
                    </div>
                    <div class="col-lg-3">
                        <slot name="sidebar" />
                    </div>
                </div>
                <slot name="bottom_bar" />
            </div>
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
import MobileMenu from '../components/offcanvases/MobileMenu.vue'
import OffcanvasSearch from '../components/OffcanvasSearch.vue'
import OfferBlock from '../components/OfferBlock.vue'
import Footer from '../components/footer/Footer.vue'
import PageTitle from '@/components/PageTitle.vue'
import PageAlertBox from '@/components/PageAlertBox.vue'
import {useGlobalStore} from '@/store/globalStore'
export default {
    props: ['noreverse'],
    setup() {
        const globalStore = useGlobalStore();
        return {
            globalStore
        };
    },
    components: {
        PageTitle,
        PageAlertBox,
        Footer,
        OfferBlock, OffcanvasSearch, MobileMenu
    },
    computed: {
        isForm() {
            return this.$route.name.includes('form')
        }
    }
}
</script>

<style>

</style>
