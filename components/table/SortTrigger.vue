<template>
    <span 
    class="sort_trigger" 
    :class="(active ? 'active ' : ' ') + order"
        >{{ name }}
        <span class="sotr_trigger__icon">
            <vue-feather type="chevron-up" size="12"/>
            <vue-feather type="chevron-down" size="12"/>
        </span>
    </span>
</template>

<script>
export default {
    props: ["active", "name", 'order'],
};
</script>

<style scoped>
    .sort_trigger{
        cursor: pointer;
    }

    .sort_trigger.active{
        color: #071031;
    }

    .sotr_trigger__icon{
        display: inline-flex;
        flex-direction: column;
        vertical-align: middle;
    }

    .sotr_trigger__icon i{
        opacity: 0.5;
    }
    .sort_trigger.active.asc .sotr_trigger__icon i:first-child{
        opacity: 1;
    }
    .sort_trigger.active.desc .sotr_trigger__icon i:nth-child(2){
        opacity: 1;
    }
</style>