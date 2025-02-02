<template>
    <main>
        <div class="grid lg:grid-cols-3 min-h-screen">
            <div class="auth_background col-span-2 hidden lg:block h-full"></div>
            <div class="auth_content col-span-1 flex items-center justify-center">
                <div
                    class="auth_container flex flex-col items-center justify-center p-5 w-full">
                    <NuxtLink to="/">
                        <img class="auth_logo mb-3" :src="globalStore.global?.logo || '/img/logo_n.png'" :alt="globalStore.global?.descriptor" />
                    </NuxtLink>
                    <NuxtPage />
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import {useGlobalStore} from "~/store/globalStore.js";

const globalStore = useGlobalStore()

</script>

<style>
</style>