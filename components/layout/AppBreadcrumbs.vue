<template>
    <Breadcrumb v-if="segments.length">
        <BreadcrumbList>
            <BreadcrumbItem>
                <BreadcrumbLink as-child>
                    <NuxtLink to="/" class="flex items-center"><Icon name="ri:home-3-line" /></NuxtLink>
                </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <template v-for="(crumb, index) in segments" :key="index">
                <BreadcrumbItem>
                    <template v-if="!crumb.current">
                        <NuxtLink v-if="crumb.path" :to="crumb.path">{{ crumb.name }}</NuxtLink>
                        <span v-else>{{ crumb.name }}</span>
                    </template>
                    <BreadcrumbPage v-else>
                        {{ crumb.name }}
                    </BreadcrumbPage>
                </BreadcrumbItem>

                <BreadcrumbSeparator v-if="index < segments.length - 1" />
            </template>
        </BreadcrumbList>
    </Breadcrumb>
</template>

<script setup lang="ts">
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator, BreadcrumbEllipsis
} from '~/components/shadcn/ui/breadcrumb'

const { segments } = useBreadcrumbs()
</script>