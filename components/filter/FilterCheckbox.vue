<template>
    <div :class="className ? className : 'col-md-6 col-lg-3'">
        <div class="form-check input_no_label">
            <input for="just_one" class="form-check-input ml-2" type="checkbox" @input="$emit('update:modelValue', $event.target.checked)">

            <label v-if="label" class="form-check-label" for="just_one">
                {{label}}
            </label>
        </div>
    </div>
</template>

<script>
/* @input="e => updateInput({name: this.filter.name, index: index}, e)" */
export default {
    props: ['value', 'label', 'className', 'modelValue'],
};
</script>

<style>
</style>