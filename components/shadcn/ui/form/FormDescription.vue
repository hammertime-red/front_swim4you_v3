<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils/shadcn'
import { useFormField } from './useFormField'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { formDescriptionId } = useFormField()
</script>

<template>
  <p
    :id="formDescriptionId"
    :class="cn('text-sm text-sub-foreground', props.class)"
  >
    <slot />
  </p>
</template>
