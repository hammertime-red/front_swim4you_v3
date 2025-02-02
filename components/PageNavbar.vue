<template>
<div class="page_navbar bg-white hidden lg:block">
    <div class="container">
        <div class="row gx-5">
            <div v-for="item in this.items" :key="item.id" class="col-auto">
                <a :href="item.link" @click="this.page_nav_active = item.id" class="page_navbar__item" :class="this.page_nav_active == item.id ? 'active' : ''">{{item.title}}</a>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            required: true
        }
    },
    data(){
        return {
            page_nav_active: 0
        }
    }
}
</script>

<style>

</style>
