<template>
<div class="page_title py-5">
    <div class="container">
        <div class="row flex-md-row-reverse">
            <div v-if="showBreadcrumbs" class="col-md-3 mb-5 mb-md-0 flex items-center justify-content-md-end">
                <nav v-if="breadcrumbs || title" style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23B9B9C3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='9 18 15 12 9 6'%3E%3C/polyline%3E%3C/svg%3E&#34;);" class="breadcrumbs" aria-label="breadcrumb">
                    <ol class="breadcrumb mb-0">
                        <li class="breadcrumb-item">
                            <NuxtLink to="/">
                                <vue-feather type="home"></vue-feather>
                            </NuxtLink>
                        </li>
                        <li v-for="(item, index) in breadcrumbs" :key="index" class="breadcrumb-item">
                            <NuxtLink :to="item.link">
                                {{item.title}}
                            </NuxtLink>
                        </li>
                        <li v-if="title" class="breadcrumb-item active" aria-current="page">
                            {{title}}
                        </li>
                    </ol>
                </nav>
            </div>
            <div :class="showBreadcrumbs ? 'col-md-9' : 'col-md-12'">
                <div v-if="!is_mobile && multiple_titles && multiple_titles.length" class="flex align-items-end">
                    <template v-for="(item, i) in multiple_titles" :key="i">
                        <template v-if="item.title">
                            <h1 v-if="$route.name == item.route_name" class="section_title_medium lh-1">{{item.title}}</h1>
                            <NuxtLink v-else :to="{name: item.route_name}">
                                <p class="section_title_medium fs-4 mb-2 lh-1">{{item.title}}</p>
                            </NuxtLink>
                            <span v-if="i < multiple_titles.length - 1" class="seperator text-sub mx-3"></span>
                        </template>
                    </template>
                </div>
                <h1 v-if="is_mobile || (title && !multiple_titles)" class="section_title_medium">{{title}}</h1>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    showBreadcrumbs: {
        type: Boolean,
        default: true
    },
    breadcrumbs: {
        type: Array,
        default: null
    },
})

</script>
