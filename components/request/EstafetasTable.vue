<template>
<div v-if="relayRacesCount > 0" class="content_box p-4 mb-4">
    <div class="content_box__header flex justify-between items-center mb-3 relative z-2">
        <h2 class="title_block mb-2">Эстафеты</h2>
    </div>
    <div class="data_table">
        <table class="table table-hover table-responsive">
            <thead>
                <tr>
                    <th scope="col font-bold">Стиль</th>
                    <th scope="col font-bold">Пол и возраст</th>
                    <th scope="col font-bold">Кол-во</th>
                </tr>
            </thead>
            <tbody>
                <EstafetasTableRow v-for="(item, i) in items" :key="i" :item="item"/>
            </tbody>
        </table>
    </div>
</div>
</template>

<script>
import EstafetasTableRow from './EstafetasTableRow'
export default {
  components: { EstafetasTableRow },
    props:{
        items: {
            type: Array,
            default: []
        }
    },
    computed: {
        relayRacesCount(){
            let quantity = 0
            this.items.forEach(item => {
                quantity += item.quantity
            })
            return quantity
        }
    }
}
</script>

<style>

</style>
