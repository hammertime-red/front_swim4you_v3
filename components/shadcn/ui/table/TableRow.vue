<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils/shadcn'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <tr :class="cn('[tbody_&]:border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', props.class)">
    <slot />
  </tr>
</template>
