<template>
  <o-field v-bind="props.field.wrapper" :label="props.field.label" :variant="variant" :message="hintText">
    <o-input v-bind="props.field" v-model="modelValue" />
  </o-field>
</template>

<script lang="ts" setup>
import { OInput } from '@oruga-ui/oruga-next'
import { usePasswordField } from '@/forms/integration'
import type { NormalizedPasswordField } from '@fancy-crud/core'

const props = defineProps<{
  field: NormalizedPasswordField
}>()

const { modelValue, hasErrors, hintText } = usePasswordField(props)

const variant = computed(() => hasErrors.value ? 'danger' : '')
</script>

