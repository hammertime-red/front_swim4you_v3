<template>
    <div v-if="name" class="table_region_item flex items-center">
        <span>{{name}}</span>
    </div>
    <div v-else class="table_region_item flex items-center">
        —
    </div>
</template>

<script>
export default {
    props: ['name']
}
</script>

<style>

</style>