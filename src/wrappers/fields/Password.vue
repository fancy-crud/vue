<template>
  <o-field v-bind="props.field.wrapper" :label="props.field.label" :variant="variant" :message="hintText">
    <o-input v-bind="props.field" v-model="modelValue" />
  </o-field>
</template>

<script lang="ts" setup>
import { OField, OInput } from '@oruga-ui/oruga-next'
import type { NormalizedPasswordField } from '@fancy-crud/core'
import { usePasswordField } from '@/forms/integration'

const props = defineProps<{
  formId: symbol
  field: NormalizedPasswordField
}>()

const { modelValue, hasFieldErrors, hintText } = usePasswordField(props)

const variant = computed(() => hasFieldErrors.value ? 'danger' : '')
</script>

