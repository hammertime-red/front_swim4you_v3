<template>
<div class="category_tabs">
	<div class="container">
		<div class="home_tabs__header flex nav nav-tabs" id="nav-tab" role="tablist">
			<button
				@click.prevent="active_tab = 0, $emit('changeCat', null)"
				class="home_tabs__item text-start"
				:class="active_tab === 0 ? 'active' : ''">
				<p class="title">Все мероприятия</p>
				<p class="subtitle text-sub mb-0">Короткое описание</p>
			</button>

			<button
				v-for="(cat, index) in CATEGORIES"
				:key="index"
				@click.prevent="active_tab = cat.id, $emit('changeCat', cat.name)"
				class="home_tabs__item text-start"
				:class="active_tab === cat.id ? 'active' : ''">
				<p class="title">{{ cat.name }}</p>
				<p class="subtitle text-sub mb-0">{{ cat.description }}</p>
			</button>
		</div>
		<div class="home_tabs__header--mobile">
			<CDropdown class="w-full">
				<CDropdownToggle
					class="home_tabs__item flex items-center justify-between">
					<div class="me-4">
						<p class="title text-start">
							{{ active_tab_title ? active_tab_title : 'Все мероприятия' }}
						</p>
						<p class="subtitle text-sub mb-0 text-start">
							{{ active_tab_subtitle ? active_tab_subtitle : 'Короткое описание' }}
						</p>
					</div>
					<vue-feather type="chevron-down" class="text-sub" />
				</CDropdownToggle>
				<CDropdownMenu class="w-full">
					<CDropdownItem>
						<button
							@click.prevent="
								;(active_tab = 0), (active_tab_title = ''), (active_tab_subtitle = ''), $emit('changeCat', null)
							"
							class="home_tabs__item"
							:class="active_tab === 0 ? 'active' : ''">
							<p class="title">Все мероприятия</p>
							<p class="subtitle text-sub mb-0">Короткое описание</p>
						</button>
					</CDropdownItem>
					<CDropdownItem v-for="(cat, index) in CATEGORIES" :key="index">
						<button
							@click.prevent="
								;(active_tab = index),
									(active_tab_title = cat.name),
									(active_tab_subtitle = cat.description), $emit('changeCat', cat.name)
							"
							class="home_tabs__item"
							:class="active_tab === index ? 'active' : ''">
							<p class="title">{{ cat.name }}</p>
							<p class="subtitle text-sub mb-0">{{ cat.description }}</p>
						</button>
					</CDropdownItem>
				</CDropdownMenu>
			</CDropdown>
		</div>
	</div>
</div>
</template>

<script>
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/vue'
import { mapGetters, mapActions } from 'vuex'
export default {
	data() {
		return {
			active_tab: 0,
			active_tab_title: '',
			active_tab_subtitle: '',
		}
	},
	computed: {
		...mapGetters({
			CATEGORIES: "photobank/getPhotobankCategories",
		}),
	},
	methods: {
		...mapActions({
            fetchPhotobankCategories: 'photobank/fetchPhotobankCategories'
        }),
	},
	async mounted(){
        await this.fetchPhotobankCategories()
    },
	emits: ['changeCat'],
	components: {
		CDropdown,
		CDropdownToggle,
		CDropdownMenu,
		CDropdownItem,
	},
}
</script>

<style scoped>
.category_tabs{
	margin-bottom: 30px;
}

.home_tabs__header{
	border: 0;
}

.home_tabs__item{
border-right-color: #20294B;
}

@media (max-width: 768px) {
	.category_tabs{
		padding: 15px 0 0;
	}
	.home_tabs__header--mobile {
		display: block;
	}

	.home_tabs__header {
		display: none !important;
	}
}

@media (min-width: 768px) {
	.home_tabs__header {
		display: block;
	}

	.home_tabs__header--mobile {
		display: none;
	}
}

.home_tabs__header--mobile .btn-group > .home_tabs__item {
	padding: 15px;
	border: 1px solid #20294B;
	margin-bottom: 15px;
	background: #071031;
	box-shadow: none !important;
	color: #fff;
}

.home_tabs__header--mobile .home_tabs__item.active {
	background: #20294b;
}

.home_tabs__header--mobile .dropdown-item{
	background: #071031;
	border-color: #20294B;
}
.home_tabs__header--mobile .dropdown-menu{
	border: 1px solid #20294B;
}

.home_tabs__header--mobile .btn-group > .home_tabs__item:after {
	display: none;
}

.home_tabs__header--mobile .dropdown-item {
	padding: 0;
}

.home_tabs__header--mobile .home_tabs__item .subtitle {
	font-family: 'Nunito Sans', sans-serif;
	font-weight: 300;
}

.category_tabs{
	background: #071031;
}
</style>
