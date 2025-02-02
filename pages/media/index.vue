<template>
    <default-layout>
        <template #content>
            <page-title title="Медиа"/>
            <div class="container mb-4">
                <!-- <filter-blue :filter="this.filter" /> -->
                <FilterWrap>
                    <FilterSelect
                        label="Событие"
                        v-model="filter.event"
                        :className="'col-12 col-md-4 col-lg-3'">
                        <option value="0">Все</option>
                        <option v-for="(item, i) in filter_data.events" :key="i" :value="item">{{item}}</option>
                    </FilterSelect>
                    <FilterSelect
                        label="Год"
                        v-model="filter.year"
                        :className="'col-12 col-md-4 col-lg-3'">
                        <option value="0">Все</option>
                        <option v-for="(item, i) in filter_data.years" :key="i" :value="item">{{item}}</option>
                    </FilterSelect>
                    <FilterInput
                        label="Поиск по названию"
                        placeholder="Введите название"
                        v-model="filter.name"
                        :className="'col-12 col-md-4 col-lg-3'"
                    />
                    <FilterClear @clicked="clearFilter()"/>
                </FilterWrap>
            </div>

            <div v-if="loaded" class="page_section">
                <div class="container">
                    <div v-if="paginatedFilteredRows.length > 0" class="row g-4 mb-4">
                        <!-- <div class="col-md-6">
                            <MediaCard :item="paginatedFilteredRows[0]" />
                        </div>
                        <div class="col-md-6 flex flex-col justify-between">
                            <div class="row g-4">
                                <div v-if="paginatedFilteredRows[1]" class="col-12">
                                    <MediaCard :item="paginatedFilteredRows[1]" :class="'card_sm_height'" />
                                </div>
                                <div v-if="paginatedFilteredRows[2]" class="col-12">
                                    <MediaCard :item="paginatedFilteredRows[2]" :class="'card_sm_height'" />
                                </div>
                            </div>
                        </div> -->

                        <template v-for="(item, i) in paginatedFilteredRows" :key="i">
                            <div class="col-md-4">
                                <MediaCard :item="item" />
                            </div>
                        </template>
                    </div>

                    <PageAlertBox v-else :alert="{class: 'alert-warning', title: 'Записей по вашему запросу не найдено', text: 'Возможно, скоро они появятся'}"/>

                    <PaginationBox class="mt-4" :currentPage="currentPage" :pageSize="pageSize" :itemsLength="filteredPosts.length" @changepage="changeCurrentPage"/>

                    <pagination-box />
                </div>
            </div>
        </template>
    </default-layout>
</template>

<script>
import FilterClear from '../components/filter/FilterClear.vue'
import FilterInput from '../components/filter/FilterInput.vue'
import FilterSelect from '../components/filter/FilterSelect.vue'
import FilterWrap from '../components/filter/FilterWrap.vue'
import PageAlertBox from '../components/PageAlertBox.vue'
import MediaCard from '../components/cards/MediaCard.vue'
import PaginationBox from '../components/PaginationBox.vue'
import PageTitle from '../components/PageTitle.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import {
    mapGetters, mapActions
} from "vuex";
import moment from 'moment'

export default {
    components: {
        FilterWrap,
        DefaultLayout,
        PageTitle,
        PaginationBox, MediaCard, PageAlertBox, FilterWrap, FilterSelect, FilterInput, FilterClear
    },
    data() {
        return {
            posts: [],
            pageSize: 15,
            currentPage: 1,
            filter: {
                event: 0,
                year: 0,
                name: ''
            },
            filter_data: {
                events: [],
                years: []
            },
            loaded: false
        }
    },
    async mounted() {
        setMeta(
            'Медиа | Swim4you.ru',
            null,
            null,
            false
        )
        await this.fetchPosts()
        this.posts = this.getPosts
        this.getFilterData()
        this.loaded = true
    },
    methods: {
        ...mapActions({
            fetchPosts: "media/fetchPosts",
        }),
        changeCurrentPage(page){
            this.currentPage = page
            return true
        },
        clearFilter(){
            this.filter = {
                event: 0,
                year: 0,
                name: ''
            }
        },
        getFilterData(){
            for(let item in this.posts){
                if(this.posts[item].event_name && !this.filter_data.events.includes(this.posts[item].event_name)){
                    this.filter_data.events.push(this.posts[item].event_name)
                }
                if(this.posts[item].year && !this.filter_data.years.includes(this.posts[item].year)){
                    this.filter_data.years.push(this.posts[item].year)
                }
            }
            this.filter_data.years.sort()
        },
    },
    computed: {
        ...mapGetters({
            getPosts: "media/getPosts",
        }),
        sortedPosts(){
            let ordered_posts = this.posts.filter(item => item.order > 0).sort((a, b) => {
                b.order - a.order
            })

            let date_posts = this.posts.filter(item =>
                !ordered_posts.includes(item)
            ).sort((a, b) => {
                return moment(b.date, 'DD-MM-YYYY') - moment(a.date, 'DD-MM-YYYY')
            })

            return ordered_posts.concat(date_posts)
        },
        filteredPosts(){
            return this.sortedPosts.filter((item, i) => {
                if((this.filter.event == 0 || this.filter.event == item.event_name)
                    && (this.filter.year == 0 || this.filter.year == item.year)
                    && (this.filter.name.toLowerCase() == '' || item.name.toLowerCase().includes(this.filter.name.toLowerCase()) || item.event_name.toLowerCase().includes(this.filter.name.toLowerCase()))
                ) {
                    return true;
                }
                return false
            })
        },
        paginatedFilteredRows: function (){
            return this.filteredPosts.filter((row, index) => {
                let start = (this.currentPage-1)*this.pageSize;
                let end = this.currentPage*this.pageSize;
                if(index >= start && index < end) return true;
            });
        },
    }
}
</script>

<style>

</style>
