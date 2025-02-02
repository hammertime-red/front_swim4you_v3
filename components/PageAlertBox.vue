<template>
<div class="alert_box">
    <div class="container">
        <div class="alert py-4" :class="alert.class">
            <p v-if="alert.title" class="alert-title text_20 font-bold">{{alert.title}}</p>
            <p v-if="alert.text" class="mb-0">{{alert.text}}</p>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: ['alert'],
}
</script>

<style scoped>
    .alert_box{
        margin-bottom: 30px;
    }
</style>
