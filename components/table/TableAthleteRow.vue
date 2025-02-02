<template>
	<tr>
		<td class="align-middle">
			<Avatar :src="item.avatar" :name="item.name" :class="'me-2'" />
			<span class="font-bold">{{ item.name }}</span>
		</td>
		<td class="align-middle">
			<span v-if="item.category" class="badge bg-warning">{{ item.category }}</span>
			<span v-else class="small text-sub">Нет разряда</span>
		</td>
		<td class="align-middle text-sub">{{ item.birthdate }}</td>
		<td class="align-middle text-sub">
			<Nation :name="item.nation" />
		</td>
		<td class="align-middle">
			<div class="table_actions flex items-center justify-content-end">
				<CDropdown direction="dropstart">
					<CDropdownToggle class="btn-circle text-primary">
						<vue-feather type="more-vertical"></vue-feather>
					</CDropdownToggle>
					<CDropdownMenu>
						<CDropdownItem class="small">
							<a @click.prevent="modal_is_open = true" href="#">Редактировать</a>
						</CDropdownItem>
						<CDropdownItem class="small">
							<SwalButton
								class="text-red-500"
								title="Вы действительно хотите удалить этого спортсмена из вашего аккаунта?"
								icon="warning"
								confirmButtonText="Удалить"
								confirmButtonColor="#EA5455"
								successText="Данные спортсмена удалены из аккаунта"
								@callback="(id) => $emit('deleteAthlete', id)"
								:callbackData="item.id">
								Удалить
							</SwalButton>
						</CDropdownItem>
					</CDropdownMenu>
				</CDropdown>
				<a @click.prevent="modal_is_open = true" href="#" class="btn-circle text-primary">
					<vue-feather type="edit"></vue-feather>
				</a>
			</div>
		</td>
	</tr>
	<EditAthlet
		:visible="modal_is_open"
		:athlete_data="item"
		@hide="modal_is_open = false" />
</template>

<script>
import EditAthlet from '../offcanvases/EditAthlet.vue'
import SwalButton from '../SwalButton.vue'
import Nation from '../UI/Nation.vue'
import Avatar from '../UI/Avatar.vue'
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/vue'
export default {
	props: {
		item: {
			type: Object,
			defautl: {},
		},
	},
	data() {
		return {
			modal_is_open: false,
		}
	},
	components: {
		Avatar,
		Nation,
		SwalButton,
		CDropdown,
		CDropdownToggle,
		CDropdownMenu,
		CDropdownItem,
		EditAthlet,
	},
	emits: ['deleteAthlete'],
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