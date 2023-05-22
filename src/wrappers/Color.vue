<template>
  <o-field v-bind="props.field.wrapper" :label="props.field.label" :variant="variant" :message="hintText">
    <o-input v-bind="props.field" v-model="modelValue" />
  </o-field>
</template>

<script lang="ts" setup>
import { OInput } from '@oruga-ui/oruga-next'
import { useColorField } from '@/forms/integration'
import type { NormalizedColorField } from '@/forms/axioma'

const props = defineProps<{
  field: NormalizedColorField
}>()

const { modelValue, hasErrors, hintText } = useColorField(props)

const variant = computed(() => hasErrors.value ? 'danger' : '')
</script>

