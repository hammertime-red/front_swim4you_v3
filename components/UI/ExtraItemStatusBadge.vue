<template>
    <span v-if="status === 'not_completed'" class="badge bg-info">В работе</span>
    <span v-if="status === 'completed'" class="badge bg-positive">Выполнен</span>
    <span v-if="status === 'rejected'" class="badge bg-destructive text-white">Отменен</span>
</template>

<script>
export default {
    props: ['status'],
}
</script>

<style>

</style>