<template>
<div class="post_nav mt-4">
    <div class="row gx-4">
        <div class="col-6">
            <div v-if="prevId" class="post_nav__item flex items-center prev">
                <NuxtLink :to="link+prevId" @click="$emit('changePage')" class="post_nav__arrow block me-2">
                    <vue-feather type="arrow-left-circle" />
                </NuxtLink>
                <div v-if="prevName" class="post_nav__desc hidden d-md-block">
                    <p class="font-bold mb-1">Назад</p>
                    <p class="small text-sub mb-0">{{prevName}}</p>
                </div>
            </div>
        </div>
        <div class="col-6">
            <div v-if="nextId" class="post_nav__item flex items-center justify-content-end next">
                <div v-if="nextName" class="post_nav__desc text-end hidden d-md-block">
                    <p class="font-bold mb-1">Вперед</p>
                    <p class="small text-sub mb-0">{{nextName}}</p>
                </div>
                <NuxtLink @click="$emit('changePage')" :to="link+nextId" class="post_nav__arrow block ms-2">
                    <vue-feather type="arrow-right-circle" />
                </NuxtLink>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: [
        'link',
        'prevId',
        'prevName',
        'nextId',
        'nextName',
    ],
    emits: ['changePage'],
}
</script>

<style>

</style>
