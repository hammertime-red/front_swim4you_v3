<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils/shadcn'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <li
    :class="cn('inline-flex items-center gap-1.5 max-w-[180px] line-clamp-1', props.class)"
  >
    <slot />
  </li>
</template>
