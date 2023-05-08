<template>
  <footer class="px-3">
    <slot v-bind="{ mainButton, auxButton, getLabel }">
      <f-button
        @click="emit('main-click')"
        :label="getLabel(mainButton)"
        :icon="!!mainButton.icon"
        :class="mainButton.class"
        :disabled="!isFormValid"
      />
      <f-button
        @click="emit('aux-click')"
        :label="getLabel(auxButton)"
        :icon="!!auxButton.icon"
        :class="auxButton.class"
      />
    </slot>
  </footer>
</template>

<script lang="ts" setup>
import type { NormalizedButton, NormalizedSettings, ObjectWithNormalizedButton } from '@/forms/core'
import { FormModes } from '@/forms/core'

const props = defineProps<{
  buttons: ObjectWithNormalizedButton
  settings: NormalizedSettings
}>()

const emit = defineEmits<{
  (e: 'main-click'): void
  (e: 'aux-click'): void
}>()

const { isFormValid } = useRules()

const mainButton = computed(() => props.buttons.main)
const auxButton = computed(() => props.buttons.aux)

const getLabel = computed(() => (button: NormalizedButton) => {
  return props.settings.mode === FormModes.CREATE_MODE ? button.label.create : button.label.update
})
</script>
