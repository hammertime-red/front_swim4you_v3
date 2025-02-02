<template>
<div class="header_navbar flex items-center ms-auto gap-2 md:gap-6">
    <div class="flex gap-3">
        <header-tools-search-icon />
        <HeaderToolsNotifications v-if="userStore.isAuthenticated" />
    </div>
    
    <HeaderToolsUser v-if="userStore.isAuthenticated" :user="userStore.userdata" />
    <div v-else class="flex items-center">
        <NuxtLink to="/auth" class="hidden lg:block btn btn-rounded font-bold py-2 px-3">Вход</NuxtLink>
        <NuxtLink to="/auth/registration" class="hidden lg:block btn btn-rounded font-bold py-2 px-3">Регистрация</NuxtLink>
        <NuxtLink to="/auth" class="flex lg:hidden font-bold py-2 px-3 leading-none  items-center">
            <Icon name="ri:account-circle-line" size="18px" />
        </NuxtLink>

    </div>
    <HeaderPhtCartButton v-if="route.path.includes('photobank')" />
    <HeaderShopCartButton v-if="route.path.includes('shop')" />
    <slot />
</div>
</template>

<script setup>
import HeaderShopCartButton from './HeaderShopCartButton.vue'
import HeaderPhtCartButton from './HeaderPhtCartButton'
import HeaderToolsUser from './HeaderToolsUser.vue'
import HeaderToolsNotifications from './HeaderToolsNotifications.vue'
import HeaderToolsSearchIcon from './HeaderToolsSearchIcon.vue'
import {ref} from "vue";
import {useRoute} from "vue-router";
import {Button} from "~/components/shadcn/ui/button/index";

const userStore = useUserStore()
const route = useRoute()
</script>

<style scoped>
.header_navbar .dropdown-header {
    padding-top: 1rem;
    padding-bottom: 1rem;
}

.header_navbar .dropdown-menu:last-child {
    border-bottom: 0;
}

.header_navbar .dropdown-menu {
    border: none;
    box-shadow: 0 15px 30px rgb(0 0 0 / 10%);
}

.btn:hover{
    background: #fff;
}
</style>
