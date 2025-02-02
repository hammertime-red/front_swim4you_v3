<script setup lang="ts">
import {Alert, AlertTitle} from "~/components/shadcn/ui/alert";

const props = defineProps({
    error: {
        type: String,
        default: null,
    }
})
</script>

<template>
    <Alert v-if="error" variant="destructive" class="flex gap-4 text-sm bg-red-50">
        <Icon name="ri:error-warning-line" />
        <AlertTitle class="mb-0">{{ error }}</AlertTitle>
    </Alert>
</template>

<style scoped>

</style>