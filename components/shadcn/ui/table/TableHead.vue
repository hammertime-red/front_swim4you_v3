<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils/shadcn'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <th :class="cn('py-2 px-4 text-left align-middle bg-primary-50 font-bold text-muted-foreground [&:has([role=checkbox])]:pr-0', props.class)">
    <slot />
  </th>
</template>
