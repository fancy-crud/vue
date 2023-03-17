<template>
  <o-field :label="props.field.label" :variant="variant" :message="message">
    <o-input v-bind="props.field" v-model="modelValue" />
  </o-field>
</template>

<script lang="ts" setup>
import type { NormalizedFieldStructure } from '@/forms'

const props = defineProps<{
  field: NormalizedFieldStructure
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void
}>()

const modelValue = useFieldModelValue(props.field, 'text', emit)
const { validate, hasFieldErrors } = useRules()

onMounted(() => validate(props.field))

const variant = computed(() => hasFieldErrors(props.field) ? 'danger' : '')

const message = computed(() => {
  let result: string = props.field.hintText ? props.field.hintText : ''

  if (props.field.errors.length)
    result = props.field.errors[0]

  return result
})

watch(modelValue, () => console.log(modelValue.value))
</script>
