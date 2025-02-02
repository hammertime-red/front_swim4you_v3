<template>
	<div class="home_tabs" id="home_tabs">
		<div class="container">
			<div class="home_tabs__header hidden lg:flex nav nav-tabs" id="nav-tab" role="tablist">
				<button
					@click.prevent="activeTab = null"
					class="home_tabs__item flex items-center justify-center"
					:class="!activeTab ? 'active' : ''">
					<p class="title">Все мероприятия</p>
				</button>

				<button
					v-for="(cat, i) in navItems"
					:key="i"
					@click.prevent="activeTab = cat"
					class="home_tabs__item"
					:class="activeTab === cat ? 'active' : ''">
					<span class="title block line-clamp-1 truncate">{{ cat.name }}</span>
					<span class="subtitle block text-sub mb-0">{{ cat.description }}</span>
				</button>
			</div>
			<div class="home_tabs__header--mobile lg:hidden">
				<CDropdown class="w-full">
					<CDropdownToggle
						class="home_tabs__item flex items-center justify-between">
						<div class="me-4">
							<p class="title text-start">
								{{ activeTab?.name || 'Все мероприятия' }}
							</p>
							<p v-if="activeTab?.description" class="subtitle text-sub mb-0 text-start">
								{{ activeTab?.description }}
							</p>
						</div>
						<vue-feather type="chevron-down" class="text-sub" />
					</CDropdownToggle>
					<CDropdownMenu class="w-full">
						<CDropdownItem>
							<button
								@click.prevent="activeTab = null"
								class="home_tabs__item"
								:class="!activeTab ? 'active' : ''">
								<p class="title">Все мероприятия</p>
								<p class="subtitle text-sub mb-0"></p>
							</button>
						</CDropdownItem>
						<CDropdownItem v-for="(cat, index) in navItems" :key="index">
							<button
								@click.prevent="activeTab = cat"
								class="home_tabs__item"
								:class="activeTab === cat ? 'active' : ''">
								<p class="title">{{ cat.name }}</p>
								<p class="subtitle text-sub mb-0">{{ cat.description }}</p>
							</button>
						</CDropdownItem>
					</CDropdownMenu>
				</CDropdown>
			</div>
		</div>
		<div class="home_tabs__line"></div>
		<div class="home_tabs__content">
			<div class="container">
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="(card, i) in filteredCards" :key="i">
                        <EventCard :event="card" />
                    </div>
                </div>
			</div>
		</div>
	</div>
</template>

<script setup>
import EventCard from '@/components/cards/EventCard.vue'
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/vue'
import {computed, ref} from "vue";

const props = defineProps({
    navItems: {
        type: Array,
    },
    cards: {
        type: Array,
    },
})

const activeTab = ref(null);

const filteredCards = computed(() => {
    return props.cards.filter((item) => !activeTab.value?.id || (item.event_category_id === activeTab.value.id) )
})
/*
export default {
	components: {
		EventCard,
		CDropdown,
		CDropdownToggle,
		CDropdownMenu,
		CDropdownItem,
	},
	data() {
		return {
			active_tab: 99,
			active_tab_title: '',
			active_tab_subtitle: '',
		}
	},
    setup(){
        const homeStore = useHomeStore();
        return { homeStore };
    },
	computed: {
		getAllEvents() {
			let all_events = []
			this.homeStore.eventTabs.forEach((element) => {
				all_events.push(...element.event_cards)
			})
			all_events = all_events.sort(
				(a, b) =>
					moment(a.start_event_date, 'DD-MM-YYYY HH:mm') -
					moment(b.start_event_date, 'DD-MM-YYYY HH:mm')
					
			)
			return all_events
		},
	},
}*/
</script>

<style scoped>
.home_tabs__header--mobile .btn-group > .home_tabs__item {
	padding: 15px;
	border: 1px solid #ebe9f1;
	margin-bottom: 15px;
	background: #fff;
	box-shadow: none !important;
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
</style>