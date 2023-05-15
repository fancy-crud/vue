<template>
  <f-control-wrap>
    <f-control-label :class="[errorStyles.textColor]">
      {{ field.label }}
    </f-control-label>

    <div
      class="relative border rounded-lg p-3 flex row flex-nowrap justify-between items-center h-full max-h-10"
      :class="[errorStyles.borderColor]"
    >
      <span class="font-medium">
        {{ modelValue }}
      </span>
      <input
        v-model="modelValue"
        v-bind="field"
        class="absolute top-0 left-0 opacity-0 h-full w-full"
      >
      <span
        class="w-6 h-6 rounded-full"
        :style="selectedColor"
      />
    </div>

    <f-control-hint-message />
  </f-control-wrap>
</template>

<script lang="ts" setup>
import type { NormalizedField } from '@/forms/core'

const props = defineProps<{
  field: NormalizedField
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void
}>()

provide('field', props.field)

const errorStyles = useErrorStyles(props.field)
const modelValue = useFieldModelValue(props.field, 'text', emit)
const { validate } = useRules()

const selectedColor = computed(() => {
  return { backgroundColor: (modelValue.value as string) || '' }
})

onMounted(() => validate(props.field))
</script>
