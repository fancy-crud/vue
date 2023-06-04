<template>
  <o-field v-bind="props.field.wrapper" :label="props.field.label" :variant="variant" :message="hintText">
    <o-select v-bind="attrs" v-model="modelValue" expanded>
      <option v-for="([label, value], index) in options" :key="index" :value="value">
        {{ label }}
      </option>
    </o-select>
  </o-field>
</template>

<script lang="ts" setup>
import { OField, OSelect } from '@oruga-ui/oruga-next'
import type { NormalizedSelectField } from '@fancy-crud/core'
import { useSelectField } from '@/forms/integration'

const props = defineProps<{
  formId: symbol
  field: NormalizedSelectField
}>()

const { modelValue, hasFieldErrors, hintText, attrs, options } = useSelectField(props)

const variant = computed(() => hasFieldErrors.value ? 'danger' : '')
</script>
