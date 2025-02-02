<script setup lang="ts">
const route = useRoute()
const routes = [
    {
        title: 'Рейтинги',
        mobile_title: 'Рейтинги/Ratings',
        route_name: 'rating'
    },
    {
        title: 'Рекорды',
        mobile_title: 'Рекорды',
        route_name: 'records'
    },
    {
        title: 'Турнирные таблицы',
        mobile_title: 'Турнирные таблицы',
        route_name: 'tournaments'
    },
    {
        title: 'Архив результатов',
        mobile_title: 'Архив результатов',
        route_name: 'results'
    },
]
</script>

<template>
    <div class="container">
        <div class="flex items-end gap-8">
            <template v-for="item in routes">
                <h1 v-if="route.name === item.route_name" class="text-5xl font-oswald uppercase">
                    <span class="hidden lg:inline">{{ item.title }}</span>
                    <span class="inline lg:hidden">{{ item.mobile_title }}</span>
                </h1>
                <NuxtLink v-else class="hidden lg:inline text-2xl font-oswald uppercase underline text-primary-500 transition-all hover:text-primary-900" :to="{path: item.route_name}">
                    {{ item.title }}
                </NuxtLink>
            </template>
        </div>
    </div>
</template>

<style scoped>

</style>