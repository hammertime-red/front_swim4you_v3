<template>
  <div class="table_toolbox flex flex-wrap justify-between align-items-end mb-2 relative z-1">
    <div v-if="limit" class="table_toolbox__item flex fw items-center mb-3">
        <span class="small text-sub me-2 hidden d-md-block">Показать</span>
        <select class="form-select">
            <option value="10" selected>10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
        </select>
    </div>
    <div class="table_toolbox__item mb-3">
        <input v-if="search" type="text" class="form-control" placeholder="Поиск..." />
    </div>
</div>
</template>

<script>
export default {

}
</script>

<style>

</style>