<script setup lang="ts">
import {Alert, AlertDescription, AlertTitle} from "~/components/shadcn/ui/alert";

const props = defineProps({
    error: {
        type: String,
        required: true,
    }
})
</script>

<template>
    <Alert variant="destructive">
        <div class="flex">
            <Icon name="ri:error-warning-line" class="mr-2" />
            <AlertTitle class="mb-0 text-sm">{{ error }}</AlertTitle>
        </div>
    </Alert>
</template>

<style scoped>

</style>