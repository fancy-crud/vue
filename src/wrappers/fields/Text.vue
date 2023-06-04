<template>
  <o-field v-bind="props.field.wrapper" :label="props.field.label" :variant="variant" :message="hintText">
    <o-input v-bind="props.field" v-model="modelValue" />
  </o-field>
</template>

<script lang="ts" setup>
import { OField, OInput } from '@oruga-ui/oruga-next'
import type { NormalizedTextField } from '@fancy-crud/core'
import { useTextField } from '@/forms/integration'

const props = defineProps<{
  formId: symbol
  field: NormalizedTextField
}>()

const { modelValue, hasFieldErrors, hintText } = useTextField(props)

const variant = computed(() => hasFieldErrors.value ? 'danger' : '')
</script>

