<template>
  <f-control-wrap>
    <f-control-label :class="[errorStyles.textColor]">
      {{ field.label }}
    </f-control-label>

    <textarea
      v-model="modelValue"
      v-bind="field"
      :class="[errorStyles.borderColor]"
    />

    <f-control-hint-message />
  </f-control-wrap>
</template>

<script lang="ts" setup>
import type { NormalizedFieldStructure } from '@/forms'

const props = defineProps<{
  field: NormalizedFieldStructure
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void
}>()

provide('field', props.field)

const errorStyles = useErrorStyles(props.field)
const modelValue = useFieldModelValue(props.field, 'text', emit)
</script>
