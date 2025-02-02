<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils/shadcn'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
    <!-- Оборачиваем в контейнер фиксированной ширины -->
    <div class="w-full">
        <!-- Добавляем внешний контейнер со скроллом -->
        <div class="relative overflow-auto max-w-[100vw]">
            <!-- Внутренний контейнер с минимальной шириной -->
            <table :class="cn('min-w-[600px] w-full caption-bottom text-sm', props.class)">
                <slot />
            </table>
        </div>
    </div>
</template>
