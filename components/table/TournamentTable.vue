<template>
<!--	<FilterWrap :class="filterClass ? filterClass : ''">
		<FilterSelect
			v-if="!altFilters"
			label="Пол"
			v-model="filter.gender"
			:className="'col-12 col-md-4 col-lg-2'">
			<option value="X">Все</option>
			<option value="M">Юноши</option>
			<option value="F">Девушки</option>
		</FilterSelect>
		<FilterSelect
			v-if="!altFilters"
			label="Возр. группа"
			v-model="filter.agegroup"
			:className="'col-12 col-md-4 col-lg-2'">
			<option value="0">Все</option>
			<option v-for="(item, i) in filter_data.age_groups" :key="i" :value="item">
				{{ item }}
			</option>
		</FilterSelect>
		&lt;!&ndash; <FilterSelect
			label="Стиль"
			v-model="filter.stroke"
			:className="altFilters ? 'col-12 col-md-3' : 'col-12 col-md-4 col-lg-2'">
			<option value="0">Все</option>
			<option v-for="(item, i) in filter_data.strokes" :key="i" :value="item">
				{{ item }}
			</option>
		</FilterSelect> &ndash;&gt;
		&lt;!&ndash; <FilterSelect
            label="Страна" 
            v-model="filter.country" 
            :className="altFilters ? 'col-12 col-md-3' :'col-12 col-md-4 col-lg-2'">
            <option value="0">Все</option>
            <option v-for="(item, i) in filter_data.countries" :key="i" :value="item">{{item}}</option>
        </FilterSelect> &ndash;&gt;
		<FilterInput
			label="Имя спортсмена"
			placeholder="Введите имя"
			v-model="filter.athlete_name"
			:className="altFilters ? 'col-12 col-md-4' : 'col-12 col-md-4 col-lg-2'" />
		<FilterClear v-if="altFilters" @clicked="clearFilter()" />
	</FilterWrap>-->
	<div class="data_table data_table--border m-0 mt-4">
 
	</div>
</template>

<script>
import FilterClear from '../filter/FilterClear'
import PaginationBox from '../PaginationBox.vue'
import FilterInput from '../filter/FilterInput'
import FilterSelect from '../filter/FilterSelect.vue'
import FilterWrap from '../filter/FilterWrap.vue'
import SortTrigger from './SortTrigger'
import Avatar from '../UI/Avatar'
export default {
	components: {
		FilterClear,
		FilterInput,
		SortTrigger,
		Avatar,
		FilterWrap,
		FilterSelect,
		PaginationBox,
	},
	props: {
		data: {
			type: Array,
			default: []
		},
		filterClass: {
			type: String,
			default: null
		},
		altFilters: {
			type: Boolean,
			default: false
		},
		show_summ: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			table_data: [],
			currentSort: 'summ',
			currentSortDir: 'desc',
			pageSize: 10,
			currentPage: 1,
			is_visible: 0,
			filter: {
				/* gender: 'X',
				agegroup: 0,
				stroke: 0,
				country: 0, */
				athlete_name: 0,
			},
			/* filter_data: {
				age_groups: [],
				strokes: [],
				countries: [],
			}, */
		}
	},
	mounted() {
		this.collectTableData()
		this.setAthletePlaces()
		/* this.getFilterData() */
	},
	computed: {
		getStages() {
			let stages = {}
			for (let ath in this.table_data) {
				for (let st in this.table_data[ath].stages) {
					let stage = this.table_data[ath].stages[st]
					if (stages[st]) {
						stages[st] = _.merge({}, stages[st], stage)
					} else {
						stages[st] = stage
					}
				}
			}
			return stages
		},
		getDistances() {
			let header_row = []

			for (let el in this.getStages) {
				for (let dist in this.getStages[el].distances) {
					header_row.push({
						name: dist,
						stage: el,
					})
				}
			}
			return header_row
		},
		sortedRows: function () {
			return this.table_data
				.sort((a, b) => {
					let modifier = 1
					if (this.currentSortDir === 'desc') modifier = -1
					if (this.currentSort.includes('deep_')) {
						let sort_str = this.currentSort.replace('deep_', '')
						sort_str = sort_str.split('__')
						if (
							a.stages[sort_str[0]].distances[sort_str[1]] <
							b.stages[sort_str[0]].distances[sort_str[1]]
						)
							return -1 * modifier
						if (
							a.stages[sort_str[0]].distances[sort_str[1]] >
							b.stages[sort_str[0]].distances[sort_str[1]]
						)
							return 1 * modifier
					} else {
						if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier
						if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier
					}

					return 0
				})
				.filter((row, index) => {
					if (this.is_show(row)) return true
				})
		},
		sortedPaginatedRows: function () {
			return this.sortedRows.filter((row, index) => {
				let start = (this.currentPage - 1) * this.pageSize
				let end = this.currentPage * this.pageSize
				if (index >= start && index < end) return true
			})
		},
	},
	methods: {
		/* getFilterData() {
			let age_groups = []
			let strokes = []
			let countries = []
			for (let el in this.table_data) {
				let age_group = this.table_data[el].meta.age
				let stroke = this.table_data[el].meta.stroke
				let country = this.table_data[el].club.nation

				if (!age_groups.includes(age_group)) {
					age_groups.push(age_group)
				}
				if (!strokes.includes(stroke)) {
					strokes.push(stroke)
				}
				if (!countries.includes(country)) {
					countries.push(country)
				}
			}
			this.filter_data.age_groups = age_groups
			this.filter_data.strokes = strokes
			this.filter_data.countries = countries
		}, */
		changeCurrentPage(page) {
			this.currentPage = page
			return true
		},
		collectTableData() {
			let data_arr = []
			for (let el in this.data) {
				let item = this.getTableDataItem(this.data[el])
				data_arr.push(item)
			}
			this.table_data = data_arr
		},
		getTableDataItem(item) {
			item.athlete_name = item.athlete.name
			item.summ = this.getAthleteSumm(item.stages)
			item.is_visible = true
			return item
		},
		getAthleteSumm(stages) {
			let summ = 0
			for (let st in stages) {
				for (let dist in stages[st].distances) {
					if (stages[st].distances[dist] > -1) {
						summ = summ + stages[st].distances[dist]
					}
				}
			}
			return summ
		},
		setAthletePlaces() {
			this.sortedRows
            for(let i = 0; i < this.table_data.length; i++){
                this.table_data[i].rating_place = i + 1
            }
			/* if (this.table_data[0] !== undefined) {
				this.table_data[0].rating_place = 1
			}
			if (this.table_data[1] !== undefined) {
				this.table_data[1].rating_place = 2
			}
			if (this.table_data[2] !== undefined) {
				this.table_data[2].rating_place = 3
			} */
		},
		sort: function (s) {
			if (s === this.currentSort) {
				this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc'
			}
			this.currentSort = s
		},
		is_show(item) {
			if (
				/* (this.filter.gender == 'X' || this.filter.gender == item.meta.gender) &&
				(this.filter.agegroup == 0 || this.filter.agegroup == item.meta.age) &&
				(this.filter.stroke == 0 || this.filter.stroke == item.meta.stroke) &&
				(this.filter.country == 0 || this.filter.country == item.club.nation) && */
				(this.filter.athlete_name == 0 ||
					item.athlete_name.toLowerCase().includes(this.filter.athlete_name.toLowerCase()))
			) {
				item.is_visible = true
				return true
			} else {
				item.is_visible = false
				return false
			}
		},
		clearFilter() {
			this.filter = {
				gender: 'X',
				agegroup: 0,
				stroke: 0,
				country: 0,
				athlete_name: 0,
			}
		},
	},
}
</script>

<style scoped></style>
