<template>
    <div class="input-group">
        <input
            :type="is_visible ? 'text' : 'password'"
            class="form-control"
            autocomplete="on"
            placeholder="Введите пароль"
            required
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
        />
        <div @click="is_visible = !is_visible" class="input-group-text">
            <vue-feather :type="is_visible ? 'eye-off' : 'eye'" size="16"></vue-feather>
        </div>
    </div>
</template>

<script>
export default {
    props: ['modelValue'],
    data(){
        return {
            is_visible: false
        }
    }
};
</script>

<style scoped>
    .input-group-text{
        cursor: pointer;
    }
</style>