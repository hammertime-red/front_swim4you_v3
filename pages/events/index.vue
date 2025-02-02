<template>
    <default-layout>
        <template #content>
            <page-title title="Мероприятия" />
            <div class="container mb-5">
                <!-- <filter-blue :filter="getFilterByName('EventsFilter')" /> -->
                <FilterWrap>
                    <FilterSelect label="Вид мероприятий" v-model="filter_type">
                        <option value="0">Все</option>
                        <option v-for="cat in getEventCats" :key="cat.id" :value="cat.id">{{cat.name}}</option>
                    </FilterSelect>
                    <FilterSelect v-if="getCities.length" label="Город" v-model="filter_city">
                        <option value="0">Все</option>
                        <option v-for="(item, i) in getCities" :key="i" :value="item">{{item}}</option>
                    </FilterSelect>
                    <FilterClear @clicked="filter_type = 0; filter_city = 0"/>
                </FilterWrap>
            </div>
            <div v-if="loaded" class="page_section">
                <div class="container">
                    <div v-for="cat in filteredEventCats" :key="cat.id" class="event_category mb-5">
                        <h2 v-if="cat.name" class="section_title_medium">{{cat.name}}</h2>
                        <div class="event_category__row row g-4">
                            <template v-for="(event, index) in cat.event_cards" :key="index">
                                <div v-if="filter_city == 0 || filter_city == event.city" class="col-lg-4 col-md-6 py-2">
                                    <event-card :event="event" :ref="'event_card'"/>
                                </div>
                            </template>
                        </div>
                    </div>
                    <PageAlertBox v-if="filteredEventCats.length == 0" :alert="{class: 'alert-warning', title: 'Мероприятий по вашему запросу не найдено', text: 'Пожалуйста, попробуйте изменить критерии фильтрации'}"/>
                </div>
            </div>
        </template>
    </default-layout>
</template>

<script>
import FilterClear from '../components/filter/FilterClear'
import FilterSelect from '../components/filter/FilterSelect'
import FilterInput from '../components/filter/FilterInput'
import FilterWrap from '../components/filter/FilterWrap.vue'
import PageAlertBox from '../components/PageAlertBox'
import PageTitle from '../components/PageTitle.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import EventCard from '@/components/cards/EventCard.vue'
import {
    mapGetters, mapActions
} from "vuex";
import { useRoute } from 'vue-router'

export default {
    components: {
        FilterClear,
        FilterSelect,
        FilterInput,
        PageAlertBox,
        DefaultLayout,
        PageTitle,
        EventCard, FilterWrap, useRoute
    },
    data() {
        return{
            filter_type: 0,
            filter_city: 0,
            event_cats: this.getEventCats,
            posts_found: 1,
            loaded: false
        }
    },
    async mounted() {
        await this.fetchEvents()
        this.setFilterbyUrl()
        this.loaded = true
        setMeta(
            'Мероприятия | Swim4you.ru',
            null,
            null,
            false
        )
    },
    beforeUpdate(){
        this.setFilterbyUrl()
    },
    methods: {
        checkCatCities(cat){
            let cities = [];
            cat.event_cards.forEach(card => {
                cities.push(card.city)
            });
            if(this.filter_city == 0) return true
            return cities.includes(this.filter_city)
        },
        setFilterbyUrl(){
            if(Object.keys(this.$route.query).length > 0){
                if(this.$route.query.cat){
                    this.filter_type = this.$route.query.cat
                }
                if(this.$route.query.filter_type){
                    this.filter_type = this.$route.query.filter_type
                }
            }
        },
        ...mapActions({
            fetchEvents: "events/fetchEventCats",
        }),
    },
    computed: {
        ...mapGetters({
            getEventCats: "events/getEventCats",
        }),
        filteredEventCats(){
            return this.getEventCats.filter( cat => {
                    return cat.event_cards.length && (this.filter_type == 0 || this.filter_type == cat.id) && this.checkCatCities(cat)
                }
            )
        },
        getCities(){
            let cities = []
            this.getEventCats.forEach(element => {
                element.event_cards.forEach(card => {
                    if(card.city){
                        cities.push(card.city)
                    }
                })
            });
            let uniq = [...new Set(cities)];
            return uniq;
        },
    },


}
</script>

<style>
</style>
