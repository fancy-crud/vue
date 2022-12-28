<template>
  <label
    v-bind="$attrs"
    class="label cursor-pointer flex items-center justify-start py-3"
  >
    <input
      v-model="modelValue"
      v-bind="field"
      class="cursor-pointer"
    >
    <span
      class="pl-4"
      :class="[errorStyles.textColor]"
    >
      {{ field.label }}
    </span>
  </label>
</template>

<script lang="ts" setup>
import type { NormalizedFieldStructure } from '@/forms'

const props = defineProps<{
  field: NormalizedFieldStructure
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void
}>()

const errorStyles = useErrorStyles(props.field)
const modelValue = useFieldModelValue(props.field, 'checkbox', emit)
</script>
