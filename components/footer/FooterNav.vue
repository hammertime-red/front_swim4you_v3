<template>
    <nav class="footer_menu grid lg:flex justify-between h-full items-center gap-4">
        <NuxtLink v-for="menuItem in globalStore.getMainMenu" :key="menuItem.id" :external="isExternal"
                  :to="menuItem.url" class="font-bold block">{{ menuItem.title }}
        </NuxtLink>
    </nav>
</template>

<script setup>
import {useGlobalStore} from '@/store/globalStore'

const globalStore = useGlobalStore();

function isExternal(el) {
    return el?.url.includes('http')
}
</script>
