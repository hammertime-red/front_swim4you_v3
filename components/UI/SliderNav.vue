<script setup lang="ts">
import {Button} from "~/components/shadcn/ui/button";

const emit = defineEmits(['clickPrev', 'clickNext'])
</script>

<template>
    <div class="flex gap-3">
        <Button variant="outline" size="icon" class="relative rounded-full border-2 text-slate-400 border-slate-400 bg-transparent hover:bg-transparent hover:border-primary-500 hover:text-primary-500 disabled:opacity-10" @click.prevent="emit('clickPrev')">
            <Icon name="ri:arrow-left-line" size="28px" />
        </Button>
        <Button variant="outline" size="icon" class="relative rounded-full border-2 text-slate-400 border-slate-400 bg-transparent hover:bg-transparent hover:border-primary-500 hover:text-primary-500 disabled:opacity-10" @click.prevent="emit('clickNext')">
            <Icon name="ri:arrow-right-line" size="28px" />
        </Button>
    </div>
</template>

<style scoped>

</style>