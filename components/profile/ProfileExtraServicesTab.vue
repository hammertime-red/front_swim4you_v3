<template>
	<div class="content_box p-4">
		<div
			class="content_box__header flex justify-between items-center mb-3 relative z-2">
			<h2 class="title_block mb-0">Дополнительные услуги</h2>
		</div>

		<DataTable
		 no_content_text="Еще нет доп. услуг">
			<template #toolbox>
				<div class="table_toolbox__item flex fw items-center mb-3">
					<span class="small text-sub me-2 hidden d-md-block">Показать</span>
					<select v-model="pageSize" class="form-select">
						<option :value="10">10</option>
						<option :value="20">20</option>
						<option :value="50">50</option>
						<option :value="100">100</option>
					</select>
				</div>
				<!-- <div class="table_toolbox__item table_toolbox__item__search mb-3">
					<input
						v-model="filter.name"
						type="text"
						class="form-control"
						placeholder="Поиск..." />
					<vue-feather v-if="filter.name" @click="clearFilterName" type="x" size="16" />
				</div> -->
			</template>
			<template #head>
				<tr>
					<th scope="col font-bold">
						<SortTrigger
							@click="sort('id')"
							:active="currentSort === 'id' ? true : false"
							name="ID"
							:order="currentSortDir" />
					</th>
					<th scope="col font-bold">
						<SortTrigger
							@click="sort('order_id')"
							:active="currentSort === 'order_id' ? true : false"
							name="Заявка"
							:order="currentSortDir" />
					</th>
					<th scope="col font-bold">
						Название
					</th>
					<th scope="col font-bold">
						Атлет
					</th>
					<th scope="col font-bold">
						<SortTrigger
							@click="sort('status')"
							:active="currentSort === 'status' ? true : false"
							name="Статус"
							:order="currentSortDir" />
					</th>
					<th scope="col font-bold">
						<SortTrigger
							@click="sort('created_at')"
							:active="currentSort === 'created_at' ? true : false"
							name="Дата"
							:order="currentSortDir" />
					</th>
					<th scope="col font-bold"></th>
				</tr>
			</template>
			<template #default>
				<tr v-for="(item, i) in sortedPaginatedRows" :key="i">
					<td class="align-middle text-sub">#{{ item.id }}</td>
					<td class="align-middle text-sub">
                        <NuxtLink
							:to="{ name: 'order', params: {id: item.order_id}}"
							class="font-bold text-decoration-none"
							>#{{ item.order_id }}</NuxtLink
						>
                    </td>
					<td class="align-middle">
						<NuxtLink
                        :to="{ name: 'extra_service_item', params: {id: item.id}}"
							class="font-bold text-decoration-none minw-200"
							>{{ item.service_name }}</NuxtLink
						>
					</td>
					<td class="align-middle">
						{{ item.athlete_name }}
					</td>
					<td class="align-middle">
						<ExtraItemStatusBadge :status="item.status" />
					</td>
					<td class="align-middle text-sub">{{ item.created_at }}</td>
					<td class="align-middle">
						<div class="table_actions flex items-center justify-content-end">
							<!-- <CDropdown direction="dropstart">
								<CDropdownToggle class="btn-circle text-primary">
									<vue-feather type="more-vertical"></vue-feather>
								</CDropdownToggle>
								<CDropdownMenu>
									<CDropdownItem v-if="item.status == 'pending_payment'" class="small">
										<a href="#" @click.prevent="toPayment(item.id)">К оплате</a>
									</CDropdownItem>
									<CDropdownItem class="small">
										<SwalButton
											class="text-red-500"
											title="Вы действительно хотите удалить этот заказ?"
											text="После этого заявку уже нельзя будет восстановить и все действия, связанные с ней, прекратятся"
											icon="warning"
											confirmButtonText="Удалить"
											confirmButtonColor="#EA5455"
											@callback="deleteRequest"
											:callbackData="item.id">
											Удалить
										</SwalButton>
									</CDropdownItem>
								</CDropdownMenu>
							</CDropdown> -->
							<NuxtLink :to="{ name: 'extra_service_item', params: {id: item.id}}" class="btn-circle text-primary">
								<vue-feather type="eye"></vue-feather>
							</NuxtLink>
						</div>
					</td>
				</tr>
			</template>
		</DataTable>

		<PaginationBox
			class="m-4 pb-4"
			:currentPage="currentPage"
			:pageSize="pageSize"
			:itemsLength="sortedRows.length"
			@changepage="changeCurrentPage" />
	</div>
</template>

<script>
import ExtraItemStatusBadge from '../UI/ExtraItemStatusBadge.vue'
import ExpiredStatus from '../UI/ExpiredStatus.vue'
import SortTrigger from '../table/SortTrigger.vue'
import DataTable from '../table/DataTable.vue'
import PaginationBox from '../PaginationBox'
import SwalButton from '~/components/SwalButton.vue'
import moment from 'moment'
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/vue'
import { mapGetters, mapActions } from 'vuex'
export default {
	data() {
		return {
			table_data: [],
			currentSort: 'created_at',
			currentSortDir: 'desc',
			pageSize: 10,
			currentPage: 1,
			is_visible: 0,
			filter: {
				name: '',
			},
			error_message: '',
		}
	},
	async mounted() {
		this.table_data = await this.fetchExtraItems()
	},
	methods: {
		...mapActions({
			fetchExtraItems: 'profile/fetchExtraItems',
		}),
		sort: function (s) {
			if (s === this.currentSort) {
				this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc'
			}
			this.currentSort = s
		},
		changeCurrentPage(page) {
			this.currentPage = page
			return true
		},
		clearFilterName() {
			this.filter.name = ''
		},
		orderExpired(id) {
			this.table_data = this.table_data.filter((item) => item.id != id)
		},
	},
	computed: {
		...mapGetters({
			getOrders: 'profile/getShopOrders',
		}),
		sortedRows: function () {
			return this.table_data
				.sort((a, b) => {
					let modifier = 1
					if (this.currentSortDir === 'desc') modifier = -1
					if (this.currentSort == 'created_at') {
						let a_time = moment(a[this.currentSort], 'DD-MM-YYYY HH:mm')
						let b_time = moment(b[this.currentSort], 'DD-MM-YYYY HH:mm')
						if (a_time < b_time) return -1 * modifier
						if (a_time > b_time) return 1 * modifier
					} else {
						if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier
						if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier
					}
					return 0
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
    components: {
		PaginationBox,
		CDropdown,
		CDropdownToggle,
		CDropdownMenu,
		CDropdownItem,
		SwalButton,
		DataTable,
		SortTrigger,
		ExpiredStatus,
        ExtraItemStatusBadge
	},
}
</script>

<style scoped>
.dropdown-menu {
	min-width: 150px;
}

.dropdown-toggle:after,
.dropdown-toggle:before {
	display: none;
}

.dropdown-menu a {
	text-decoration: none;
	color: #071031;
}
</style>