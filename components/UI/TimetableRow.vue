<template>
    <div class="row gy-4">
        <div 
            v-for="(item, i) in items" 
            :key="i" 
            :class="
                items.length % 3 == 0 || items.length % 5 == 0
                    ? 'col-md-4'
                    : 'col-md-6'
            ">
            <div class="content_box schedule__item p-4">
                <div
                    class="content_box__header flex justify-between items-center mb-3 relative z-2">
                    <h2 class="title_block mb-2 text-sub">{{item.name}}</h2>
                </div>
                <table
                    v-if="Object.keys(item.items).length > 0"
                    class="list_box__content">
                    <tr v-for="(el, n) in item.items" :key="n">
                        <td class="text-accent font-bold">{{ el.time }}</td>
                        <td class="ps-2 w-full">{{ el.text }}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['items'],
};
</script>

<style>
</style>