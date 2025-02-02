<template>
<form @submit.prevent class="filter_box filter_box_default p-4 p-sm-4 text-white" :class="this.class">
    <div class="row g-3">
        <slot/>

        <div v-if="this.$slots.expand" class="col-auto ms-0 ms-md-auto text-end flex align-items-end">
            <button @click="this.is_expanded = !this.is_expanded" class="expand_btn btn btn-sm btn-rounded btn-outline btn-outline-light pe-3 mb-1">
            <vue-feather :type="this.is_expanded ? 'chevron-up' : 'chevron-down'" />{{this.is_expanded ? 'Скрыть' : 'Все фильтры'}}</button>
        </div>

        

    </div>
    <template v-if="this.$slots.expand">
        <transition name="slide">
            <div v-if="is_expanded" class="row g-4 mt-3 expand_row">
                <slot name="expand"/>
            </div>
        </transition>
    </template>
    <template v-if="this.$slots.bottom_row">
        <transition name="slide">
            <div class="row g-4 mt-3">
                <slot name="bottom_row"/>
            </div>
        </transition>
    </template>
    
</form>
</template>

<script>

export default {
    props: ['class'],
    data(){
        return {
            is_expanded: false
        }
    },
}
</script>

<style scoped>
.expand_btn{
    padding: 12px 12px;
    font-size: 14px;
}

.expand_btn i{
    width: 14px;
    height: 14px;
}
</style>
