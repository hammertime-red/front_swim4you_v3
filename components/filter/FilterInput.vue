<template>
    <div :class="className ? className : 'col-md-6 col-lg-3'">
        <label class="d-block">
            <span v-if="label" class="font-bold">{{ label }}</span>
            <input
                :type="!type ? 'text' : type"
                class="form-control"
                :placeholder="placeholder ? placeholder : 'Введите текст'"
                @input="$emit('update:modelValue', $event.target.value)"
                :min="min ?? 0"
                :max="max ?? null"
                autocomplete="off"
            />
        </label>
    </div>
</template>

<script>
/* @input="e => updateInput({name: this.filter.name, index: index}, e)" */
export default {
    props: ['placeholder', 'value', 'type', 'label', 'className', 'modelValue', 'min', 'max'],
};
</script>

<style>
</style>