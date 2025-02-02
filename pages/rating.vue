<template>
    <div class="my-12">
        <RatingsTitle class="mb-12" />
        <div class="page_section">
            <div class="container">
                <RatingTable class="mb-20" />
                <RelaysTable />
            </div>
        </div>
    </div>
</template>

<script setup>
import RatingTable from '../components/RatingTable.vue'
import RatingsTitle from "~/components/UI/RatingsTitle.vue";
import RelaysTable from "~/components/RelaysTable.vue";

definePageMeta({
    name: 'rating'
})

</script>
