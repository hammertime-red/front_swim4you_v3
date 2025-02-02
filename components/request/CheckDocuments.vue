<template>
<div class="upload_documents" :class="is_active ? 'active' : ''">
    <div class="upload_documents__header flex justify-between items-center p-3">
        <p v-if="!name" class="font-bold mb-0">Документы</p>
        <div v-if="name" class="table_name_item flex items-center">
            <img v-if="avatar" class="rounded-circle me-2" :src="avatar" />
            <div class="name">
                <span class="font-bold">{{name}}</span>
                <span v-if="birthdate" class="d-block text-sub text-sm">{{birthdate}} г.р</span>
            </div>
        </div>
        <button @click="is_active = !is_active" class="btn btn-rounded btn-outline btn-outline-muted text-sub btn-sm">
            <vue-feather :type="is_active ? 'chevron-up' : 'chevron-down'" /> {{is_active ? 'Свернуть' : 'Развернуть'}}</button>
    </div>
    <transition name="slide">
    <div v-if="is_active" class="upload_documents__items px-3">
        <div class="upload_documents__item flex justify-between items-center py-3">
            <div class="upload_documents__item__label text-sm">
                <span class="d-block font-bold text-positive">Название документа</span>
                <span class="d-block text-sub">Требуется скан-копия</span>
            </div>
            <div class="upload_documents__item__value text-end">
                <span class="badge bg-positive">Загружено</span>
                <p class="mb-0 text-sub filename">nazvanie_documenta.jpg</p>
            </div>
        </div>
        <div class="upload_documents__item flex justify-between items-center py-3">
            <div class="upload_documents__item__label text-sm">
                <span class="d-block font-bold text-positive">Название документа</span>
                <span class="d-block text-sub">Требуется скан-копия</span>
            </div>
            <div class="upload_documents__item__value text-end">
                <span class="badge bg-positive">Загружено</span>
                <p class="mb-0 text-sub filename">nazvanie_documenta.jpg</p>
            </div>
        </div>

    </div>
    </transition>
</div>
</template>

<script>
export default {
    props: ['name', 'avatar', 'birthdate'],
    data(){
        return {
            is_active: true
        }
    }
}
</script>

<style scoped>
.filename {
    font-size: 12px;
}

.upload_documents__header {
    background: #e9ebf1;
    border-radius: 5px;
}

.active .upload_documents__header{
    border-radius: 5px 5px 0 0;
}

.upload_documents__items {
    background: #f5f6fa;
    border-radius: 0 0 5px 5px;
}

.upload_documents__item {
    border-bottom: 1px solid #e9ebf1;
}

.upload_documents__item:last-child{
    border: none;
}

.btn-outline-muted{
    border: 1px solid #B9B9C3;
}

.btn-outline-muted:hover{
    background: #B9B9C3;
    color: #fff !important;
}
.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.2s ease-in-out;
}

.slide-enter-to,
.slide-leave-from {
  overflow: hidden;
  max-height: 1000px;
}

.slide-enter-from,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
}
</style>
