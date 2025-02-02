<template>
    <default-layout>
        <template #content>
            <page-title title="Турнирные таблицы" :multiple_titles="[
                {
                    title: 'Рейтинги',
                    route_name: 'rating'
                },
                {
                    title: 'Рекорды',
                    route_name: 'records'
                },
				{
                    title: 'Турнирные таблицы',
                    route_name: 'tournaments'
                },
				{
                    title: 'Архив результатов',
                    route_name: 'results'
                },
            ]" />
            <div class="container mb-5">
                <FilterWrap>
                    <FilterSelect
                        label="Год/Year"
                        v-model="filter.year"
                        :className="'col-12 col-md-2 col-lg-2'">
                        <option value="0">Все</option>
                        <option v-for="(item, i) in filter_data.years" :key="i" :value="item">
                            {{ item }}
                        </option>
                    </FilterSelect>
                    <FilterSelect
                        label="Соревнование/Competition"
                        v-model="filter.event_name"
                        :className="'col-12 col-md-4 col-lg-2'">
                        <option value="0">Все</option>
                        <option v-for="(item, i) in filter_data.event_names" :key="i" :value="item">
                            {{ item }}
                        </option>
                    </FilterSelect>
                    <FilterSelect
                        label="Стиль/Stroke"
                        v-model="filter.stroke_rus_name"
                        :className="'col-12 col-md-4 col-lg-2'">
                        <option value="0">Все</option>
                        <option v-for="(item, i) in filter_data.stroke_names" :key="i" :value="item">
                            {{ item }}
                        </option>
                    </FilterSelect>
                    <FilterSelect
                        label="Возрастная группа/Age group"
                        v-model="filter.age_category"
                        :className="'col-12 col-md-4 col-lg-2'">
                        <option value="0">Все</option>
                        <option v-for="(item, i) in filter_data.age_categories" :key="i" :value="item">
                            {{ item }}
                        </option>
                    </FilterSelect>
                    <FilterClear @clicked="clearFilter()" />
                </FilterWrap>
            </div>
            <div class="page_section">
                <div v-if="filteredTournaments.length" class="container">
                    <template v-for="year in Object.keys(tournamentsByYear).sort((a,b) => b - a )" :key="year">
                        <div class="record_category mb-5">
                            <h2 class="section_title_medium">{{ year }}</h2>
                            <template v-for="(item, i) in tournamentsByYear[year]" :key="i">
                                <TournamentCat :item="item" />
                            </template>
                        </div>
                    </template>
                    <p class="small text-sub mt-5">
                        В случае, когда двое или более спортсменов в общем зачёте набирают равное
                        количество очков, победителем (либо занявшим более высокое место) признаётся
                        спортсмен, участвовавший и показавший лучший результат (лучшее количество очков
                        в данной категории) на последнем этапе. В случае если не один из данных
                        спортсменов не участвовал в последнем этапе, то победитель определяется
                        аналогично по результатам (участию), показанным на предыдущем этапе и т.д. Это
                        же правило действует при подведении промежуточных итогов. При равных
                        показателях и в этом случае, победитель определяется по лучшему результату
                        (очки FINA) показанному на последнем этапе.
                    </p>
                </div>
                <PageAlertBox
                    v-else
                    :alert="{
						class: 'alert-warning',
						title: 'Записей по вашему запросу не найдено',
						text: 'Пожалуйста, попробуйте изменить критерии фильтрации',
					}" />
            </div>
        </template>
    </default-layout>
</template>

<script>
import PageAlertBox from '../components/PageAlertBox.vue'
import FilterClear from '../components/filter/FilterClear.vue'
import FilterSelect from '../components/filter/FilterSelect.vue'
import FilterWrap from '../components/filter/FilterWrap.vue'
import TournamentCat from '../components/TournamentCat'
import DataTable from '../components/table/DataTable'
import PageTitle from '../components/PageTitle.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import FilterBlue from '@/components/FilterBlue.vue'
import RecordCard from '@/components/cards/RecordCard.vue'
import { mapGetters, mapActions } from 'vuex'
//import setMeta from ''
import { strokes } from '@/helpers/fieldNames'
export default {
    components: {
        TournamentCat,
        DataTable,
        DefaultLayout,
        FilterBlue,
        PageTitle,
        RecordCard,
        FilterWrap,
        FilterSelect,
        FilterClear,
        PageAlertBox,
    },
    data() {
        return {
            tournaments: [],
            filter: {
                year: 0,
                event_name: 0,
                age_category: 0,
                stroke_rus_name: 0,
            },
            filter_data: {
                years: [],
                event_names: [],
                age_categories: [],
                stroke_names: [],
            },
        }
    },
    async mounted() {
        //setMeta('Турнирные таблицы | Swim4you.ru', null, null, false)
        await this.fetchTournaments()
        this.getFilterData()

    },
    computed: {
        ...mapGetters({
            getTournaments: 'results/getTournaments',
        }),
        tournamentsByYear() {
            return _.groupBy(this.filteredTournaments, (item) => item.year)
        },
        filteredTournaments(){
            return this.sortedTounaments.filter(item => {
                return (this.filter.age_category == 0 || this.filter.age_category == item.age_category) &&
                    (this.filter.event_name == 0 || this.filter.event_name == item.event_name) &&
                    (this.filter.stroke_rus_name == 0 || this.filter.stroke_rus_name == item.stroke_rus_name) &&
                    (this.filter.year == 0 || this.filter.year == item.year)
            })
        },
        sortedTounaments() {
            return this.getTournaments
            let sorted_obj = []

            this.getTournaments.sort((a, b) => {
                return a.agemin - b.agemin
            }).forEach((item) => {
                if (strokes.includes(item.stroke_rus_name)) {
                    if (!sorted_obj[item.stroke_rus_name]) sorted_obj[item.stroke_rus_name] = []
                    sorted_obj[item.stroke_rus_name].push(item)
                } else {
                    if (!sorted_obj['Командный зачет']) sorted_obj['Командный зачет'] = []
                    sorted_obj['Командный зачет'].push(item)
                }
            })

            let sorted_items = []
            sorted_obj.sort((a, b) => {
                return strokes.indexOf(a) - strokes.indexOf(b)
            })

            strokes.forEach((key) => {
                if (sorted_obj[key]) {
                    sorted_items.push(...sorted_obj[key])
                }
            })

            return sorted_items
        },
    },
    methods: {
        ...mapActions({
            fetchTournaments: 'results/fetchTournaments',
        }),
        clearFilter() {
            this.filter = {
                year: 0,
                event_name: 0,
                age_category: 0,
                stroke_rus_name: 0,
            }
        },
        getFilterData() {
            for (let item in this.getTournaments) {
                let year = this.getTournaments[item].year
                if (!this.filter_data.years.includes(year)) {
                    this.filter_data.years.push(year)
                }

                let event_name = this.getTournaments[item].event_name
                if (!this.filter_data.event_names.includes(event_name)) {
                    this.filter_data.event_names.push(event_name)
                }

                let stroke_name = this.getTournaments[item].stroke_rus_name
                if (!this.filter_data.stroke_names.includes(stroke_name)) {
                    this.filter_data.stroke_names.push(stroke_name)
                }

                let age_category = this.getTournaments[item].age_category
                if (!this.filter_data.age_categories.includes(age_category)) {
                    this.filter_data.age_categories.push(age_category)
                }
            }

            this.filter_data.years.sort()
            this.filter_data.event_names.sort()
            this.filter_data.stroke_names.sort((a, b) => {
                if (strokes.indexOf(a) < 0) {
                    return strokes.indexOf(b) - strokes.indexOf(a)
                }
                return strokes.indexOf(a) - strokes.indexOf(b)
            })
            this.filter_data.age_categories.sort()
        },
    },
}
</script>

<style scoped>
.tournament_item__table .filter_box {
    border-radius: 0;
    background: #071031;
}
</style>
