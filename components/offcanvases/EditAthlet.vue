<template>
	<OffcanvasInline
		@show="showModal"
		@hide="$emit('hide'), (visible = !visible)"
		:visible="visible">
		<p v-if="athlete_data" class="section_title_medium">Редактировать спортсмена</p>
		<p v-else class="section_title_medium">Создать спортсмена</p>
		<p class="text-sub mb-5">
			Заполните все поля и приложите указанные документы, если вы планируете проходить комиссию по допуску онлайн
		</p>
		<div class="mb-3">
			<UploadAvatar v-model="form_data.avatar" />
		</div>
		<form v-if="visible" @submit.prevent="storeAthlete">
			<label class="mb-3 block w-full">
				<span class="font-bold">Фамилия <span class="text-red-500">*</span></span>
				<input
					v-model="form_data.lastname"
					type="text"
					class="form-control"
					placeholder="Иванов"
					:disabled="!!athlete_data"
					required />
			</label>
			<label class="mb-3 block w-full">
				<span class="font-bold">Имя <span class="text-red-500">*</span></span>
				<input
					v-model="form_data.firstname"
					type="text"
					class="form-control"
					placeholder="Иван"
					:disabled="!!athlete_data"
					required />
			</label>
			<label class="mb-3 block w-full">
				<span class="font-bold">Отчество </span>
				<input
					v-model="form_data.fathername"
					type="text"
					class="form-control"
					placeholder="Иванович" />
			</label>
			<div class="row g-3 mb-3">
				<div class="col-md-4">
					<label class="d-block w-full">
						<span class="font-bold">Дата рождения <span class="text-red-500">*</span></span>
						<input
							v-model="form_data.birthdate"
							class="form-control"
							type="date"
							:disabled="!!athlete_data"
							required />
					</label>
				</div>
				<div class="col-md-4">
					<label class="d-block w-full">
						<span class="font-bold">Пол <span class="text-red-500">*</span></span>
						<select
							v-model="form_data.gender"
							class="form-select"
							:disabled="!!athlete_data"
							required>
							<option :value="null" disabled>Выберите</option>
							<option value="M">Муж.</option>
							<option value="F">Жен</option>
						</select>
					</label>
				</div>
				<div class="col-md-4">
					<label class="d-block w-full">
						<span class="font-bold">Разряд <span class="text-red-500">*</span></span>
						<select v-model="form_data.category" class="form-select" required>
							<option :value="null" disabled>Выберите</option>
							<option v-for="(cat, i) in globalStore.getCategories" :key="i" :value="cat">
								{{ cat }}
							</option>
						</select>
					</label>
				</div>
				<div class="col-md-12">
					<label class="d-block w-full">
						<span class="font-bold">Гражданство <span class="text-red-500">*</span></span>
						<select v-model="form_data.nation" class="form-select" required>
							<option :value="null" disabled>Выберите страну</option>
							<option v-for="(value, key) in globalStore.getCountries" :key="key" :value="key">
								{{ value }}
							</option>
						</select>
					</label>
				</div>
			</div>

			<div class="mb-3">
				<UploadDocuments
					v-model="form_data.documents"
					:is_active="upload_documents_expanded"
					@addFile="addFile"
					@removeFile="removeFile" />
			</div>

			<button
				type="submit"
				class="btn btn-primary btn-primary-shadow btn-rounded mt-auto px-5">
				Сохранить
			</button>
		</form>
	</OffcanvasInline>
</template>

<script>
import OffcanvasInline from './OffcanvasInline.vue'
import UploadDocuments from '../forms/UploadDocuments'
import UploadAvatar from '../forms/UploadAvatar.vue'
import moment from 'moment'
/*import { storeAthleteAPI } from '@/API/api'*/
import {useGlobalStore} from '@/store/globalStore'
export default {
	components: {
		UploadDocuments,
		UploadAvatar,
		OffcanvasInline,
	},
	data() {
		return {
			form_data: {
				id: null,
				avatar: null,
				firstname: null,
				lastname: null,
				fathername: null,
				birthdate: null,
				gender: null,
				category: null,
				nation: null,
				documents: [],
			},
			upload_documents_expanded: false,
			error_message: null,
		}
	},
    setup() {
        const globalStore = useGlobalStore();
        return {
            globalStore
        };
    },
	methods: {
		addFile(data) {
			if (
				this.form_data.documents.length > 0 &&
				this.form_data.documents.find((item) => item.name === data.name)
			) {
				this.form_data.documents.map((obj) => data.find((o) => o.name === obj.name) || obj)
			} else {
				this.form_data.documents.push(data)
			}
		},
		removeFile(data) {
			var index = this.form_data.documents.findIndex((object) => {
				return object.name === data.name
			})
			if (index !== -1) {
				this.form_data.documents.splice(index, 1)
			}
		},
		async storeAthlete() {
			let res = await storeAthleteAPI(this.form_data.id, this.getFormData())
            if(res){
                this.$emit('hide')
            }
		},
		getFormData() {
			let fd = new FormData()
			if (this.form_data.id) fd.append('id', this.form_data.id)
			if (this.form_data.avatar) fd.append('avatar', this.form_data.avatar)
			if (this.form_data.firstname) fd.append('firstname', this.form_data.firstname)
			if (this.form_data.lastname) fd.append('lastname', this.form_data.lastname)
			if (this.form_data.fathername) fd.append('fathername', this.form_data.fathername)
			if (this.form_data.birthdate)
				fd.append(
					'birthdate',
					moment(this.form_data.birthdate, 'YYYY-MM-DD').format('DD/MM/YYYY')
				)
			if (this.form_data.gender) fd.append('gender', this.form_data.gender)
			if (this.form_data.category && this.form_data.category != 'Нет разряда') fd.append('category', this.form_data.category)
			if (this.form_data.nation) fd.append('nation', this.form_data.nation)
			if (this.form_data.documents) {
				for (var i = 0; i < this.form_data.documents.length; i++) {
					fd.append('documents[' + i + '][name]', this.form_data.documents[i].name)
					let filelist = this.form_data.documents[i].document
					if(filelist && typeof filelist == 'object'){
						for (var n = 0; n < filelist.length; n++) {
							fd.append('documents[' + i + '][document]['+n+']', filelist[n])
						}
					} else{
						fd.append('documents[' + i + '][document]', filelist)
					}
				}
			}
			return fd
		},
		showModal() {
			if (this.athlete_data) {
				this.form_data = Object.assign(this.form_data, this.athlete_data)
				this.form_data.birthdate = moment(this.form_data.birthdate, 'DD/MM/YYYY').format(
					'YYYY-MM-DD'
				)
			} else {
				this.form_data = {
					avatar: null,
					firstname: null,
					lastname: null,
					fathername: null,
					birthdate: null,
					gender: null,
					category: null,
					nation: null,
					documents: [],
				}
			}
			this.upload_documents_expanded = false
		},
	},
	props: ['visible', 'athlete_data'],
}
</script>

<style></style>