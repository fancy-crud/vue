<template>
  <o-field v-bind="props.field.wrapper" :label="props.field.label" :variant="variant" :message="hintText">
    <o-select v-bind="fieldAttrs" v-model="modelValue" expanded>
      <option v-for="([label, value], index) in options" :key="index" :value="value">
        {{ label }}
      </option>
    </o-select>
  </o-field>
</template>

<script lang="ts" setup>
import { OSelect } from '@oruga-ui/oruga-next'
import type { NormalizedSelectField } from '@/forms/axioma'
import { useHintText, useOptions } from '@/forms/integration/composables/fields/utils'

const props = defineProps<{
  field: NormalizedSelectField
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

const { hintText } = useHintText(props)

const { options } = useOptions(props)

onMounted(() => validate(props.field))

watch(modelValue, (value) => {
  Object.assign(props.field, { modelValue: value })
}, { deep: true })
</script>

