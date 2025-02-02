<template>
    <div class="content_box hotel_variant p-4">
        <div
            class="
                content_box__header
                flex
                justify-between
                items-center
                mb-3
                relative
                z-2
            "
        >
            <h2 class="text_20 mb-0 font-bold">{{ item.name }}</h2>
        </div>
        <div class="row g-3">
            <div v-if="item.address" class="col">
                <p class="text-sub text-sm mb-0">Адрес:</p>
                <p class="mb-0">{{ item.address }}</p>
            </div>
            <div v-if="item.link" class="col-auto">
                <a
                    :href="item.link"
                    target="_blank"
                    rel="nofollow"
                    class="
                        btn btn-outline btn-outline-secondary btn-sm btn-rounded
                        uppercase
                    "
                >
                    <vue-feather type="link" class="text-primary" />На сайт</a
                >
            </div>
            <div v-if="item.thumbnail" class="col-12">
                <img :src="item.thumbnail" class="rounded" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['item']
};
</script>

<style>
</style>