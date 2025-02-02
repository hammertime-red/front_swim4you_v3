<template>
    <div class="content_box schedule__item p-4">
        <div class="about_hotel">
            <div class="about_hotel__icon text-sub fs-1 mb-3">
                <vue-feather type="map-pin" />
            </div>
            <div class="row g-4">
                <div class="col-lg-6">
                    <div class="about_hotel__content">
                        <h3 v-if="name" class="font-bold fs-3">
                            {{ name }}
                        </h3>
                        <div v-if="desc"
                            class="longtext_content"
                            v-html="desc"
                        ></div>
                    </div>
                </div>
                <div v-if="coord" class="col-lg-6">
                    <p class="title_block text-sub">Карта проезда</p>
                    <YandexMap :coords="coord.split(',')" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import YandexMap from '../YandexMap.vue'
export default {
    components: { YandexMap },
    props: ['name', 'desc', 'coord'],
};
</script>

<style>
</style>