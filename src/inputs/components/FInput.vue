<template>
  <o-field :label="props.field.label" :variant="variant" :message="message">
    <o-input v-model="modelValue" />
  </o-field>
</template>

<script lang="ts" setup>
import type { NormalizedField } from '@/forms/core'

const props = defineProps<{
  field: NormalizedField
}>()

const modelValue = useVModel(props.field, 'modelValue', undefined, { passive: true })

const { validate, hasFieldErrors } = useRules()

const variant = computed(() => hasFieldErrors(props.field) ? 'danger' : '')

const message = computed(() => {
  let result: string = props.field.hintText ? props.field.hintText : ''

  if (props.field.errors.length)
    result = props.field.errors[0]

  return result
})

onMounted(() => validate(props.field))

watch(modelValue, (value) => {
  Object.assign(props.field, { modelValue: value })
}, { deep: true })
</script>
