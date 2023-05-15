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
import type { NormalizedField } from '@/forms/core'

const props = defineProps<{
  field: NormalizedField
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void
}>()

const errorStyles = useErrorStyles(props.field)
const modelValue = useFieldModelValue(props.field, 'checkbox', emit)
const { validate } = useRules()

onMounted(() => validate(props.field))
</script>
