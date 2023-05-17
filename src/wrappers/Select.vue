<template>
  <o-field v-bind="props.field.wrapper" :label="props.field.label" :variant="variant" :message="message">
    <o-select v-bind="fieldAttrs" v-model="modelValue" expanded>
      <option v-for="([label, value], index) in computedOptions" :key="index" :value="value">
        {{ label }}
      </option>
    </o-select>
  </o-field>
</template>

<script lang="ts" setup>
import { OSelect } from '@oruga-ui/oruga-next'
import type { NormalizedField } from '@/forms/core'

const props = defineProps<{
  field: NormalizedField
}>()

const modelValue = useVModel(props.field, 'modelValue', undefined, { passive: true })

const { validate, hasFieldErrors } = useRules()

const fieldAttrs = computed(() => {
  const {
    type: _type,
    options: _options,
    wrapper: _wrapper,
    ...attrs
  } = props.field
  return attrs
})

const variant = computed(() => hasFieldErrors(props.field) ? 'danger' : '')

const message = computed(() => {
  let result: string = props.field.hintText ? props.field.hintText : ''

  if (props.field.errors.length)
    result = props.field.errors[0]

  return result
})

const computedOptions = computed(() => {
  const options = props.field.options || []

  const optionValue = props.field.optionValue || ''
  const optionLabel = props.field.optionLabel || ''

  return options.reduce((previousValue: any, currentValue: any) => {
    const value = currentValue[optionValue] || currentValue
    const label = currentValue[optionLabel] || currentValue

    return [...previousValue, [label, value]]
  }, [] as Array<Array<any>>)
})

onMounted(() => validate(props.field))

watch(modelValue, (value) => {
  Object.assign(props.field, { modelValue: value })
}, { deep: true })
</script>

