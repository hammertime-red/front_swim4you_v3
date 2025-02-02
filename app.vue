<script setup>
import {Toaster} from "~/components/shadcn/ui/toast";

const globalStore = useGlobalStore();
const userStore = useUserStore();
const shopStore = useShopStore();
globalStore.fetchSettings()
userStore.restoreState();
shopStore.setCart()

</script>

<style>
.page-enter-active,
.page-leave-active {
    transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
    opacity: 0;
    filter: blur(1rem);
}
</style>


<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
    <Toaster />
</template>
