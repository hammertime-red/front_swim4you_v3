<template>
    <div :class="className ? className : 'col-md-6 col-lg-3'">
        <label class="d-block">
            <span v-if="label" class="font-bold">{{ label }}</span>
            <select class="form-select" :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
                <slot />
            </select>
        </label>
    </div>
</template>

<script>
/* @input="e => updateInput({name: this.filter.name, index: index}, e)" */
export default {
    props: ["value", "label", "className", 'modelValue'],
};
</script>

<style>
</style>