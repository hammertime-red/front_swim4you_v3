<template>
<div class="header_navbar bg-white">
    <div class="container z-100">
        <nav class="font-bold">
                <ul class="flex items-center border-slate-300">
                    <li
                        v-for="item in globalStore.main_menu"
                        :key="item.id"
                        class="relative group flex items-center border-r first:border-l"
                    >
                        <component
                            :is="isExternal(item.url) ? 'a' : linkComponent"
                            :href="item.url"
                            :to="!isExternal(item.url) ? item.url : null"
                            :target="isExternal(item.url) ? item.target : null"
                            class="py-4 px-5 hover:bg-slate-50 flex items-center transition-all"
                            :class="{
                                'border-b-2 text-blue-500 border-blue-500': route.path === item.url
                            }"
                        >
                            {{ item.title }}
                            <Icon
                                v-if="item.children.length > 0"
                                name="ri-arrow-down-s-line"
                                class="ml-2 w-4 h-4"
                            />
                        </component>

                        <ul
                            v-if="item.children.length > 0"
                            class="absolute hidden group-hover:block bg-white text-slate-800 shadow-lg z-10 top-full left-0 min-w-[300px]"
                        >
                            <li
                                v-for="child in item.children"
                                :key="child.id"
                            >
                                <component
                                    :is="isExternal(child.url) ? 'a' : linkComponent"
                                    :href="child.url"
                                    :to="!isExternal(child.url) ? child.url : null"
                                    :target="isExternal(child.url) ? child.target : null"
                                    class="block px-5 py-4 hover:bg-slate-50 border-b border-slate-300 transition-all"
                                >
                                    {{ child.title }}
                                </component>
                            </li>
                        </ul>
                    </li>
                </ul>
        </nav>

    </div>
</div>
</template>

<script setup>
import {useGlobalStore} from '@/store/globalStore'

const route = useRoute()
const globalStore = useGlobalStore();
const isExternal = (url) => /^https?:\/\//.test(url);
const linkComponent = resolveComponent('NuxtLink');

</script>

<style>

</style>
