<template>
  <main
    class="px-4 grid grid-cols-12 gap-x-8"
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
        v-model="field.modelValue"
      />
      <slot :name="`after-${fieldKey}`" />
    </template>
  </main>
</template>

<script lang="ts" setup>
import type { NormalizedField, NormalizedSettings, ObjectWithNormalizedField } from '@/forms/core'
import { FormModes } from '@/forms/core'
import { GetForeignKeyValues } from '@/http/core/services/get-foreign-key-values'
import { RequestService } from '@/http/integration/services'
import { controls } from '@/settings'

const props = defineProps<{
  fields: ObjectWithNormalizedField
  settings: NormalizedSettings
}>()

const getComponent = (field: NormalizedField) => {
  type ControlType = keyof typeof controls
  return controls[field.type as ControlType] || controls.text
}

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
  const requestService = new RequestService(httpConfig)
  const getForeignKeyValues = new GetForeignKeyValues(requestService, httpConfig.pagination)
  getForeignKeyValues.execute(props.fields)
})
</script>
