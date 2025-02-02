<template>
<div class="inputgroup_athlet content_box p-4 mb-4">
    <button @click="removeAthletFieldGroup(index)" v-if="index !== 0" class="btn btn-circle text-sub mb-2 ms-auto">
        <vue-feather type="trash-2" />
    </button>
    <div class="row g-3">
        <div class="col-xxl-6">
            <div class="input_add_edit row gx-1">
                <div class="col-auto">
                    <label for="add_edit">
                        <span class="font-bold">Выберите участника <span class="text-red-500">*</span></span>
                    </label>
                </div>
                <div class="col text-end">
                    <a v-if="!searchInDatabase" @click.prevent="searchInDatabase = !searchInDatabase" href="#" class="text-sub text-sm">Выбрать из базы</a>
                    <a v-if="searchInDatabase" @click.prevent="searchInDatabase = !searchInDatabase" href="#" class="text-sub text-sm">Выбрать из аккаунта</a>
                </div>
                <div class="col-12">
                    <select v-if="!searchInDatabase" id="add_edit" class="form-select">
                        <option disabled selected>Выберите вариант</option>
                        <option value="20">Вариант 1</option>
                        <option value="50">Вариант 2</option>
                        <option value="100">Вариант 3</option>
                    </select>
                    <VSelect v-if="searchInDatabase" :options="['Атлет 1','Атлет 2','Атлет 3']" placeholder="Начните вводить имя">
                        <template #no-options>
                            <div>Нет подходящих вариантов</div>
                        </template>
                    </VSelect>
                </div>
                <div class="col-12">
                    <a @click.prevent="globalStore.toggleOffcanvas('edit_athlet')" href="#" class="text-sub text-sm">Редактировать выбранного</a>
                </div>
            </div>
        </div>
        <div class="col-sm-6 col-xxl-3 flex items-center">
            <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" value="1" :id="'onlide_docs_'+index" v-model="item.online_request">
                <label class="form-check-label text-sm" :for="'onlide_docs_'+index">
                    Предоставить документы для онлайн-допуска
                </label>
            </div>
        </div>
        <div class="col-sm-6 col-xxl-3 flex justify-content-sm-end">
            <div v-if="item.online_request" class="docs_checker">
                <p class="font-bold mb-1">Документы</p>
                <div class="docs_checker__cont flex">
                    <div class="alert alert-xs alert-danger bg-body mb-0 me-2"><span class="alert-title">Недостаточно</span></div>
                    <button @click.prevent="globalStore.toggleOffcanvas('add_documents')" class="btn btn-sm btn-primary btn-primary-shadow">Добавить</button>
                </div>
            </div>
        </div>
        <div v-if="!item.online_request" class="col-12">
            <div v-html="getOfflineRequestText()" class="alert alert-warning bg-body mb-0 me-2"></div>
        </div>
    </div>
</div>
</template>

<script>
import VSelect from "vue-select";
import {
    mapMutations, mapGetters
} from "vuex"
import {useGlobalStore} from '@/store/globalStore'
export default {
    components: {
        VSelect
    },
    props: ['item', 'index'],
    data(){
        return {
            searchInDatabase: false
        }
    },
    setup() {
        const globalStore = useGlobalStore();
        return {
            globalStore
        };
    },
    methods: {
        ...mapGetters({
            getOfflineRequestText: "formCompetition/getOfflineRequestText",
        }),
        ...mapMutations({
            removeAthletFieldGroup: "formCompetition/removeAthletFieldGroup",
        }),
    }
}
</script>

<style>

</style>
