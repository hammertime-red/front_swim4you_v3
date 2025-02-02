<template>
<!--<yandex-map :settings="map.settings" :coords="coords" :zoom="14" :controls="map.controls">
    <ymap-marker :coords="coords" marker-id="123" />
</yandex-map>-->
    Map
</template>

<script>
//import { yandexMap, ymapMarker } from 'vue-yandex-maps'
export default {
    components: {
        //yandexMap, ymapMarker
    },
    props: ['coords'],
    data(){
        return {
            map: {
                settings: {
                    apiKey: '1d9207f7-2d72-44ea-aa89-987d0c2535f2',
                    lang: 'ru_RU',
                    coordorder: 'latlong',
                    enterprise: false,
                    version: '2.1'
                },
                controls: ['zoomControl', 'fullscreenControl']
            }
        }
    }
}
</script>

<style>
    .ymap-container {
        height: 100%;
        border-radius: 10px;
        overflow: hidden;
        min-height: 300px;
    }

    @media(max-width: 768px){
        .ymap-container {
            min-height: 150px;
        }
    }

    .ymap-container [class *= "ground-pane" ]{
        filter: grayscale(100%);
    }
</style>
