<template>
    <div :class="className ? className : 'col-md-6 col-lg-3'">
        <label class="d-block">
            <span v-if="label" class="font-bold">{{ label }}</span>
            <VSelect :options="options" placeholder="Начните вводить название" class="text-dark" @input="$emit('update:modelValue', $event.target.value)" :value="modelValue">
                <template #no-options>
                    <div>Нет подходящих вариантов</div>
                </template>
            </VSelect>
        </label>
    </div>
</template>

<script>
import VSelect from "vue-select";
export default {
    props: ["label", "className", 'modelValue', 'options'],
    components: {
        VSelect
    },
};
</script>

<style>
</style>