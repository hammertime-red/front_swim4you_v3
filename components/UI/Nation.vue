<template>
    <div v-if="name" class="table_region_item flex items-center">
        <img :src="flag" class="rounded-circle me-2" /><span :class="text_class">{{name}}</span>
    </div>
    <div v-else class="table_region_item flex items-center">
        —
    </div>
</template>

<script>
export default {
    props: ['name', 'text_class'],
    computed: {
        flag(){
            switch(this.name){
                case 'RUS': return '/assets/img/flags/rus.svg'
                case 'KAZ': return '/assets/img/flags/kaz.svg'
                case 'BEL': return '/assets/img/flags/bel.svg'
            }
        }
    }
}
</script>

<style>

</style>