<template>
  <header class="f-form-header p-3">
    <slot v-bind="{ title }">
      <h3 class="text-2xl">
        {{ title }}
      </h3>
    </slot>
  </header>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { NormalizedSettings, NormalizedTitles } from '@/forms/core'
import { FormModes } from '@/forms/core'

const props = defineProps<{
  titles: NormalizedTitles
  settings: NormalizedSettings
}>()

const title = computed(() => {
  return props.settings.mode === FormModes.CREATE_MODE
    ? props.titles.create
    : props.titles.update
})
</script>
