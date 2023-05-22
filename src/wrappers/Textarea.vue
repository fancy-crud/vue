<template>
  <o-field v-bind="props.field.wrapper" :label="props.field.label" :variant="variant" :message="hintText">
    <o-input v-bind="props.field" v-model="modelValue" />
  </o-field>
</template>

<script lang="ts" setup>
import { OInput } from '@oruga-ui/oruga-next'
import { useTextareaField } from '@/forms/integration'
import type { NormalizedTextareaField } from '@/forms/axioma'

const props = defineProps<{
  field: NormalizedTextareaField
}>()

const { modelValue, hasErrors, hintText } = useTextareaField(props)

const variant = computed(() => hasErrors.value ? 'danger' : '')
</script>

