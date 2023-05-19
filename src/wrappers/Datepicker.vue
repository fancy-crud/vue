<template>
  <o-field v-bind="props.field.wrapper" :label="props.field.label" :variant="variant" :message="hintText">
    <o-datepicker v-bind="props.field" v-model="modelValue" />
  </o-field>
</template>

<script lang="ts" setup>
import { ODatepicker } from '@oruga-ui/oruga-next'
import { useDatepickerField } from '@/forms/integration'
import type { NormalizedDatepickerField } from '@/forms/core'

const props = defineProps<{
  field: NormalizedDatepickerField
}>()

const { modelValue, hasErrors, hintText } = useDatepickerField(props)

const variant = computed(() => hasErrors.value ? 'danger' : '')
</script>

