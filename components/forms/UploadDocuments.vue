<template>
<div class="upload_documents" :class="is_active ? 'active' : ''">
    <div class="upload_documents__header flex justify-between items-center p-3">
        <p v-if="!name" class="font-bold mb-0">Документы</p>
        <div v-if="name" class="table_name_item flex items-center">
            <Avatar :name="name" :src="avatar" :class="'me-2'" />
            <div class="name">
                <span class="font-bold">{{name}}</span>
                <span v-if="birthdate" class="d-block text-sub text-sm">{{birthdate}} г.р</span>
            </div>
        </div>
        <button @click.prevent="is_active = !is_active" class="btn btn-rounded btn-outline btn-outline-muted text-sub btn-sm">
            <vue-feather :type="is_active ? 'chevron-up' : 'chevron-down'" /> {{is_active ? 'Свернуть' : 'Развернуть'}}</button>
    </div>
    <transition name="slide">
    <div v-if="is_active" class="upload_documents__items px-3">
        <template v-for="(item, i) in schema" :key="i">
            <UploadDocumentItem 
                :schema="item" 
                v-model="theModel[getModelKey(item.name)].document"
            /> 
        </template>
    </div>
    </transition>
</div>
</template>

<script>
import Avatar from '../UI/Avatar'
import UploadDocumentItem from './UploadDocumentItem'
import { computed } from 'vue';
import {useGlobalStore} from '@/store/globalStore'
export default {
  components: {
    Avatar, UploadDocumentItem },
    props: {
        name: {
            type: String,
            default: null,
        },
        avatar: {
            type: String,
            default: null,
        },
        birthdate: {
            type: String,
            default: null,
        },
        is_active: {
            type: Boolean,
            default: false,
        },
        required_documents: {
            type: Array,
            default: [],
        },
        modelValue: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const theModel = computed({  
            get: () => props.modelValue,
            set: (value) => emit('update:modelValue', value),
        });
        return { theModel };
    },
    beforeUpdate(){
    },
    methods: {
        getModelKey(name){
            if(this.theModel.length < 1) this.createDocumentData()
            if(!this.theModel.find(x => x.name === name)){
                this.theModel.push({
                    id: null,
                    name: name, 
                    document: null
                })
            }
            const iterator = this.theModel.keys();

            for (const key of iterator) {
                if(this.theModel[key].name === name) return key
            }
        },
        createDocumentData(){
            this.schema.forEach(item => {
                this.theModel.push({
                    id: null,
                    name: item.name,
                    document: null
                })
            })
        }
    },
    computed: {
        setup() {
            const globalStore = useGlobalStore();
            return {
                globalStore
            };
        },
        schema(){
            if(this.required_documents && this.required_documents.length > 0){
                return this.globalStore.getAthleteDocuments.filter(item => {
                    return this.required_documents.includes(item.name)
                })
            } else {
                return this.globalStore.getAthleteDocuments
            }
        },
    }
}
</script>

<style scoped>
.filename {
    font-size: 12px;
}

.upload_documents__header {
    background: #e9ebf1;
    border-radius: 5px;
}

.active .upload_documents__header{
    border-radius: 5px 5px 0 0;
}

.upload_documents__items {
    background: #f5f6fa;
    border-radius: 0 0 5px 5px;
}

.upload_documents__item {
    border-bottom: 1px solid #e9ebf1;
}

.upload_documents__item:last-child{
    border: none;
}

.btn-outline-muted{
    border: 1px solid #B9B9C3;
}

.btn-outline-muted:hover{
    background: #B9B9C3;
    color: #fff !important;
}
</style>
