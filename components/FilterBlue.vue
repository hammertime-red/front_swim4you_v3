<template>
<div class="filter_box filter_box_default p-4 p-sm-4 text-white">
    <div class="row g-4">
        <div v-for="(item, index)  in this.filter.items" :key="item.id" :class="item.class ? item.class :'col-md-6 col-lg-3'">
            <label class="d-block">
                <span class="font-bold">{{item.title}}</span>
                <select v-if="item.type === 'select'" class="form-select" :value="item.value" @input="e => updateInput({name: this.filter.name, index: index}, e)">
                    <option disabled value="0">{{item.placeholder ? item.placeholder : 'Выберите вариант'}}</option>
                    <option v-for="subitem in item.variants" :key="subitem.value" :value="subitem.value">{{subitem.label}}</option>
                </select>
                <input v-if="item.type === 'text'" type="text" class="form-control" :placeholder="item.placeholder ? item.placeholder : 'Введите текст'" :value="item.value" @input="e => updateInput({name: this.filter.name, index: index}, e)">
            </label>
        </div>
        <div v-if="this.filter.clearButton || this.filter.expandItems.length" class="col-lg-1">
            <div class="col-auto">
                <div class="filter_box__toolset input_no_label flex justify-between items-center w-full">
                    <button v-if="this.filter.clearButton" @click="resetFilter(this.filter.name)" type="reset" class="btn btn-white btn-circle text-primary me-3">
                        <vue-feather type="rotate-ccw"></vue-feather>
                    </button>
                    <button @click="this.is_expanded = !this.is_expanded" class="btn btn-sm btn-rounded btn-outline btn-outline-light pe-4" v-if="this.filter.expandItems.length">
                        <vue-feather type="chevron-down"></vue-feather>{{this.is_expanded ? 'Скрыть' : 'Все фильтры'}}
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
    mapMutations
} from "vuex"
export default {
    props: {
        filter: {
            type: Object,
            required: true
        }
    },
    data(){
        return {
            is_expanded: false
        }
    },
    methods: {
        ...mapMutations({
            setActiveFilters: "filters/setActiveFilters",
            resetFilter: "filters/resetFilter",
            setValueByName: "filters/setValueByName",
        }),
        updateInput(obj, e) {
            obj.value = e.target.value
            this.setActiveFilters(obj)
        },
        setInputsByUrlParams() {
            if (Object.keys(this.$route.query).length) {
                for (let i = 0; i < Object.keys(this.$route.query).length; i++) {
                    let key = Object.keys(this.$route.query)[i]
                    let value = this.$route.query[key]
                    this.setValueByName({
                        name: this.filter.name,
                        key: key,
                        value: value
                    })

                }
            } else {
                this.resetFilter(this.filter.name)
            }
        }
    },
    mounted() {
        this.setInputsByUrlParams()
    },
    watch: {
        $route(to, from) {
            this.setInputsByUrlParams()
        }
    }
}
</script>

<style>

</style>
