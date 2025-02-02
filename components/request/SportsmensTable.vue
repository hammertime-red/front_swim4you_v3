<template>
<div class="content_box p-4 mb-4">
    <div class="content_box__header flex justify-between items-center mb-3 relative z-2">
        <h2 class="title_block mb-2">Спортсмены</h2>
    </div>
    <div class="data_table">
        <table class="table table-hover table-responsive">
            <thead>
                <tr>
                    <th scope="col font-bold">ФИО</th>
                    <th scope="col font-bold">Дата рождения</th>
                    <th scope="col font-bold">Разряд</th>
                    <th v-if="distances" scope="col font-bold">Дистанции и заявочное время</th>
                    <th v-if="documents" scope="col font-bold">Онлайн-допуск</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, i) in items" :key="i">
                    <td class="small align-middle">
                        <div class="table_name_item flex items-center">
                            <Avatar :src="item.athlete?.avatar" :name="item.athlete?.name" :class="'me-2'" />
                            <span class="font-bold lh-1">{{item?.athlete?.name}}</span>
                        </div>
                    </td>
                    <td class="small align-middle">{{item?.athlete?.birthdate}}</td>
                    <td class="small align-middle">
                        <span v-if="item.athlete?.category" class="badge bg-warning">{{item.athlete.category}}</span>
                    </td>
                    <td v-if="distances" class="small align-middle">
                        <p v-for="(dist, n) in item.distances" :key="n" class="mb-0">
                            {{dist.stroke_name}} - <b>{{correctEntrytime(dist.entrytime)}}</b>
                        </p>
                    </td>
                    <td v-if="documents" class="small align-middle text-end">
                        <vue-feather v-if="item.online_request" type="check-square" class="text-positive"/>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</template>

<script>
import Avatar from '@/components/UI/Avatar.vue'
import {mapGetters} from 'vuex'
export default {
    props:{
        distances:{
            type: Boolean,
            default: false
        },
        documents:{
            type: Boolean,
            default: false
        },
        short_swimtime: {
            type: Boolean,
            default: true
        }
    },
    data(){
        return {
            modal_visible: false
        }
    },
    computed: {
        items(){
            return _.chain(this.DISTANCE_ITEMS).groupBy(item => {
                    return item.athlete_id
            }).map(group => {
                return {
                    athlete: this.ATHLETES.find(athlete => athlete.id == group[0].athlete_id),
                    distances: group
                }
            })
        },
        ...mapGetters({
            DISTANCE_ITEMS: 'order/DISTANCE_ITEMS',
            ATHLETES: 'athletes/getAthletes'
        })
    },
    methods: {
        correctEntrytime(entrytime){
            if(!entrytime) return null;
            if(this.short_swimtime && entrytime.length == 11){
                return entrytime.slice(3)
            }
            return entrytime
        }
    },
    components: { Avatar },
}
</script>

<style scoped>
    thead th{
        font-size: 14px;
    }
</style>
