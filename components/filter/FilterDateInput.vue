<template>
    <div :class="className ? className : 'col-md-6 col-lg-3'">
        <label class="d-block">
            <span v-if="label" class="font-bold">{{ label }}</span>
            <input
                type="date"
                class="form-control"
                :placeholder="placeholder ? placeholder : 'Введите текст'"
                 @input="$emit('update:modelValue', $event.target.value)"
            />
        </label>
    </div>
</template>

<script>
/* @input="e => updateInput({name: this.filter.name, index: index}, e)" */
export default {
    props: ['placeholder', 'label', 'className', 'modelValue'],
};
</script>

<style>
</style>