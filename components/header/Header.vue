<template>
<header :class="globalStore.getBackgroundStatus ? 'blured' : ''">
    <div class="header__top pt-3 pb-3">
        <div class="container flex items-center">
            <MobileMenu>
                <Button variant="link" class="lg:hidden mr-6 p-0">
                    <Icon name="ri:menu-2-line" size="24px" />
                </Button>
            </MobileMenu>


            <div class="header_brand flex items-center mr-auto">
                <NuxtLink to="/" class="header_brand__logo block mr-3">
                    <img :src="globalStore.global?.logo || '/img/logo_n.png'" :alt="globalStore.global?.descriptor" />
                </NuxtLink>
                <p v-if="globalStore.global?.descriptor" class="header_brand__desc text-sm text-slate-400 mb-0 hidden lg:block">
                    {{
                        globalStore.global?.descriptor
                    }}
                </p>
            </div>
            <header-tools></header-tools>
        </div>
    </div>
    <header-navbar class="hidden lg:block" />
</header>
</template>

<script setup>
import HeaderNavbar from '@/components/header/HeaderNavbar.vue'
import HeaderTools from '@/components/header/HeaderTools.vue';
import MobileMenu from "~/components/header/MobileMenu.vue";
import {Button} from "~/components/shadcn/ui/button/index.ts";
const globalStore = useGlobalStore();
</script>

<style>
header.blured {
    filter: blur(10px);
}
</style>
