<template>
<div class="row avatar_upload items-center justify-center mb-3 w-full">
    <div class="col-md-4 col-6">
        <img v-if="modelValue" class="avatar_upload__img rounded-circle" :src="modelValue" />
        <img v-else class="avatar_upload__img rounded-circle" src="/img/default_avatar.svg" />
    </div>
    <div class="col-md-8 col-auto">
        <p class="font-bold mb-1">Аватар</p>
        <div class="avatar_upload__actions mb-2">
            <button @click.prevent="showCropper = true" href="#" class="me-2 btn btn-warning btn-sm text-sm">Загрузить</button>
            <button v-if="modelValue" @click="$emit('update:modelValue', null)" class="btn btn-outline-danger btn-sm text-sm">
                Удалить
            </button>
        </div>
        <span class="text-sub text-sm">Разрешены файлы: png, jpg, jpeg.</span>
    </div>
    <AvatarCropper 
        v-model="showCropper"
        :upload-handler="handleUploading"
        :output-mime="'image/jpeg'"
        :labels="{submit: 'Выбрать', cancel: 'Назад'}"
        :output-options="{width: 150, height: 150}"
    />
</div>
</template>

<script>
import AvatarCropper from 'vue-avatar-cropper'
export default {
    components: {AvatarCropper},
    props: ['modelValue'],
    emits: ['update:modelValue'],
    data(){
        return{
            showCropper: false
        }
    },
    methods:{
        handleUploading(e){
            let image = e.getCroppedCanvas({
                width: 150,
                height: 150,
            }).toDataURL("image/jpeg")
            this.$emit('update:modelValue', image)
        }
    }
}
</script>

<style>

</style>
