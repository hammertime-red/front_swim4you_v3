<template>
    <tr v-if="relay_race && item.quantity > 0">
        <td class="align-middle">
            <span class="font-bold">{{relay_race.distance_short_name}}</span>
        </td>
        <td class="align-middle">{{relay_race.age_name}}</td>
        <td class="align-middle">{{item.quantity}}</td>
    </tr>
</template>

<script>
import {mapGetters} from "vuex"
export default {
    props: ['item'],
    data(){
        return {
            relay_race: null
        }
    },
    async mounted(){
        this.relay_race = await this.relayRace(this.item.distance_id)
    },
    computed: {
        ...mapGetters({
            relayRace: 'events/getRelayRaceByID',
        }),
    }
}
</script>

<style>

</style>