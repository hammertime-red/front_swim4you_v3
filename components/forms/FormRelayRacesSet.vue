<template>
<div class="content_box px-4 py-6">
    <div class="content_box__header flex justify-between items-center mb-3 relative z-2">
        <h2 class="title_block mb-2">Выберите эстафеты, в которых участвует клуб</h2>
    </div>
    <div class="relay_form">
        <EstafetaField 
            v-for="item in items"
            :key="item.id" 
            :item="item" />
    </div>
</div>
</template>

<script>
import EstafetaField from '@/components/forms/EstafetaField.vue'
export default {
    components: { EstafetaField },
    props: {
        items:{
            type: Array,
            default: () => []
        },
        price: {
            type: Number,
            default: 0
        }
    },
}
</script>

<style>

</style>
