<template>

<div v-if="this.$slots.toolbox" class="table_toolbox flex flex-wrap justify-between align-items-end mb-2 relative z-1">
    <slot name="toolbox" />
</div>

<div class="data_table" :class="this.class">
    <table class="table table-hover table-responsive">
        <thead>
            <slot name="head" />
        </thead>
        <tbody ref="tableContent">
            <slot />
        </tbody>
    </table>
    <div v-if="!hasContent" class="table__no_content text-center fs-3 py-3 text-sub">
        <img src="/img/table_no_content.svg">
        <div>{{no_content_text ? no_content_text : 'Нет строк для отображения'}}</div>
    </div>
</div>
</template>

<script>
export default {
    data(){
        return {
            hasContent: true,
        }
    },
    props: ['class', 'no_content_text'],
    updated(){
        this.checkIsEmptyContent()
    },
    methods: {
        checkIsEmptyContent(){
            if(this.$refs.tableContent.childNodes.length <= 2) {
                this.hasContent = false 
            } else {
                this.hasContent = true 
            }
        }
    }
}
</script>

<style>
.table__no_content img{
    max-width: 430px;
}
</style>
