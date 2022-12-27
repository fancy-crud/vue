<template>
  <main
    class="grid grid-cols-12 gap-x-8"
    v-bind="$attrs"
  >
    <template
      v-for="([fieldKey, field]) in filters"
      :key="fieldKey"
    >
      <slot :name="`before-${fieldKey}`" />
      <component
        :is="getComponent(field)"
        v-bind="{ field }"
      />
      <slot :name="`after-${fieldKey}`" />
    </template>
  </main>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import type { NormalizedFieldStructure, NormalizedFields } from '@/forms'

import FInput from '@/inputs/components/FInput.vue'
import FInputDate from '@/inputs/components/FInputDate.vue'
import FCheckbox from '@/inputs/components/FCheckbox.vue'
import FInputPassword from '@/inputs/components/FInputPassword.vue'
import FSelect from '@/inputs/components/FSelect.vue'
import FRadio from '@/inputs/components/FRadio.vue'
import FColor from '@/inputs/components/FColor.vue'
import FTextarea from '@/inputs/components/FTextarea.vue'
import FInputFile from '@/inputs/components/FInputFile.vue'

const props = defineProps<{
  filters: NormalizedFields
}>()

const controls = {
  text: FInput,
  date: FInputDate,
  password: FInputPassword,
  select: FSelect,
  autocomplete: FSelect,
  checkbox: FCheckbox,
  radio: FRadio,
  color: FColor,
  textarea: FTextarea,
  file: FInputFile,
  image: FInputFile,
}

const getComponent = (field: NormalizedFieldStructure) => {
  type ControlType = keyof typeof controls
  return controls[field.type as ControlType] || controls.text
}

const filters = computed(() => {
  const _filters = Object.entries(props.filters).filter(([_, filter]) => {
    if (filter.hidden)
      return false

    return true
  })

  return _filters
})

onMounted(() => {
  getForeignKeys(props.filters)
})
</script>
