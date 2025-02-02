<template>
	<div
		class="upload_documents__item flex justify-between items-center py-3">
		<div class="upload_documents__item__label text-sm me-3">
			<span
				class="d-block font-bold"
				:class="modelValue ? 'text-positive' : 'text-accent'"
				>{{ schema.name }}</span
			>
			<span v-if="schema.desc" class="d-block text-sub">{{ schema.desc }}</span>
		</div>

		<div
			class="upload_documents__item__value flex justify-content-end items-center">
			<div class="text-end">
				<label>
					<input
						@change="setFile"
						ref="fileInput"
						type="file"
						class="hidden"
						accept="image/*, .pdf"
						:multiple="schema.multiple" />
					<span v-if="!modelValue" class="btn btn-warning btn-sm"> Загрузить </span>
				</label>
				<span v-if="modelValue" class="badge" :class="isNewFile ? 'bg-info' : 'bg-positive'">{{ isNewFile ? 'Загружен' : 'Добавлен'}}</span>
				<p
					v-if="modelValue && modelValue.name"
					class="mt-1 mb-0 text-sub filename text-sm">
					{{ modelValue.name }}
				</p>
			</div>
			<vue-feather
				v-if="modelValue && !isNewFile"
				@click="show"
				class="btn_icon ms-3"
				type="eye"
				size="16" />
			<vue-feather
				v-if="modelValue"
				@click="clearData"
				class="btn_icon btn_icon_delete ms-3"
				type="trash"
				size="16" />
		</div>
	</div>
</template>

<script>
export default {
	props: ['schema', 'modelValue'],
	methods: {
		setFile(e) {
			this.$emit('update:modelValue', e.target.files)
		},
		clearData() {
			this.$refs.fileInput.value = null
			this.$emit('update:modelValue', null)
		},
		show() {
            let model = this.modelValue
            if(typeof this.modelValue == 'string'){
                model = JSON.parse(model)
            }
            let link = null;
            if(Array.isArray(model)){
                if(model.length > 1){
                    model.forEach(item => {
                        window.open(item, '_blank');
                    })
                    return
                } else {
                    link = model[0]
                }
            }
            else if(typeof this.modelValue == 'object'){
                return
            }
            else {
                link = model
            }

            if(link){
                window.open(link, '_blank');
            }
		},
	},
    computed: {
        isNewFile(){
            return typeof this.modelValue == 'object' && this.modelValue instanceof FileList
        }
    },
	emits: ['update:modelValue'],
}
</script>

<style scoped>
.btn_icon {
	color: #b9b9c3;
	cursor: pointer;
    transition: color .4s;
}

.btn_icon:hover {
	color: #0d6efd;
}

.btn_icon.btn_icon_delete:hover {
	color: rgb(209, 71, 71);
}
</style>
