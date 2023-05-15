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
import type { Ref } from 'vue'
import type { NormalizedField } from '@/forms/core'

const props = defineProps<{
  field: NormalizedField
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void
}>()

provide('field', props.field)

const errorStyles = useErrorStyles(props.field)
const modelValue: Ref<any> = useFieldModelValue(props.field, 'text', emit)
const { validate } = useRules()

onMounted(() => validate(props.field))
</script>
