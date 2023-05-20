<template>
  <main
    class="f-form-body"
    v-bind="$attrs"
  >
    <template
      v-for="([fieldKey, field]) in fields"
      :key="fieldKey"
    >
      <slot :name="`before-${fieldKey}`" />
      <component
        :is="getComponent(field)"
        v-bind="{ field }"
      />
      <slot :name="`after-${fieldKey}`" />
    </template>
  </main>
</template>

<script lang="ts" setup>
import { useFormManager } from '../composables'
import type { NormalizedField, NormalizedSettings, ObjectWithNormalizedFields } from '@/forms/core'
import { FormModes } from '@/forms/core'
import { controls } from '@/settings'

const props = defineProps<{
  formId: symbol
  fields: ObjectWithNormalizedFields
  settings: NormalizedSettings
}>()

const { getForeignKeyValues } = useFormManager(props.formId)

const fields = computed(() => {
  const _fields = Object.entries(props.fields).filter(([_, field]) => {
    if (field.hidden)
      return false

    if (field.createOnly && props.settings.mode !== FormModes.CREATE_MODE)
      return false

    if (field.updateOnly && props.settings.mode === FormModes.CREATE_MODE)
      return false

    return true
  })

  return _fields
})

onMounted(() => {
  getForeignKeyValues(Object.fromEntries(fields.value))
})

function getComponent(field: NormalizedField) {
  type ControlType = keyof typeof controls
  return controls[field.type as ControlType] || controls.text
}
</script>

<style lang="sass">
.f-form-body
  @apply grid grid-cols-12 gap-x-8 gap-y-4
</style>
