<template>
  <o-field v-bind="props.field.wrapper" :label="props.field.label" :variant="variant" :message="hintText">
    <o-datepicker v-bind="props.field" v-model="modelValue" />
  </o-field>
</template>

<script lang="ts" setup>
import { ODatepicker, OField } from '@oruga-ui/oruga-next'
import type { NormalizedDatepickerField } from '@fancy-crud/core'
import { useDatepickerField } from '@/forms/integration'

const props = defineProps<{
  formId: symbol
  field: NormalizedDatepickerField
}>()

const { modelValue, hasFieldErrors, hintText } = useDatepickerField(props)

const variant = computed(() => hasFieldErrors.value ? 'danger' : '')
</script>

