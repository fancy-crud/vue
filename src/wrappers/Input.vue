<template>
  <o-field v-bind="props.field.wrapper" :label="props.field.label" :variant="variant" :message="hintTextOrErrors">
    <o-input v-bind="props.field" v-model="modelValue" />
  </o-field>
</template>

<script lang="ts" setup>
import { OInput } from '@oruga-ui/oruga-next'
import { useInput } from '@/forms/integration'
import type { NormalizedTextField } from '@/forms/core'

const props = defineProps<{
  field: NormalizedTextField
}>()

const { modelValue, hasErrors, hintTextOrErrors } = useInput(props)

const variant = computed(() => hasErrors.value ? 'danger' : '')
</script>

