<template>
    <div class="col-auto flex align-items-end">
        <button @click="clicked"
            type="reset"
            class="reset_btn btn btn-white btn-rounded text-primary mb-1"
        >
            <vue-feather type="rotate-ccw" size="12"></vue-feather><span class="">Сбросить</span>
        </button>
    </div>
</template>

<script>
export default {
    methods: {
    clicked() {
      this.$emit('clicked');
    }
  }
};
</script>

<style scoped>
.reset_btn{
    padding: 12px 12px;
    font-size: 14px;
}

.reset_btn i{
    width: 14px;
    height: 14px;
}
</style>