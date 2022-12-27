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
      />
      <slot :name="`after-${fieldKey}`" />
    </template>
  </main>
</template>

<script lang="ts" setup>
import type { Form, NormalizedFieldStructure } from '@/forms'
import FInput from '@/inputs/components/FInput.vue'
import FInputDate from '@/inputs/components/FInputDate.vue'
import FCheckbox from '@/inputs/components/FCheckbox.vue'
import FInputPassword from '@/inputs/components/FInputPassword.vue'
import FSelect from '@/inputs/components/FSelect.vue'
import FRadio from '@/inputs/components/FRadio.vue'
import FColor from '@/inputs/components/FColor.vue'
import FTextarea from '@/inputs/components/FTextarea.vue'
import FInputFile from '@/inputs/components/FInputFile.vue'

const props = defineProps<{
  form: Form
}>()

const controls = {
  text: FInput,
  date: FInputDate,
  password: FInputPassword,
  select: FSelect,
  autocomplete: FSelect,
  checkbox: FCheckbox,
  radio: FRadio,
  color: FColor,
  textarea: FTextarea,
  file: FInputFile,
  image: FInputFile,
}

const getComponent = (field: NormalizedFieldStructure) => {
  type ControlType = keyof typeof controls
  return controls[field.type as ControlType] || controls.text
}

const fields = computed(() => {
  const _fields = Object.entries(props.form.fields).filter(([_, field]) => {
    if (field.hidden)
      return false

    if (field.createOnly && props.form.settings.mode !== FormModes.CREATE_MODE)
      return false

    if (field.updateOnly && props.form.settings.mode === FormModes.CREATE_MODE)
      return false

    return true
  })

  return _fields
})

onMounted(() => getForeignKeys(props.form.fields))
</script>
