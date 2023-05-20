<template>
  <footer class="form-footer">
    <slot v-bind="{ mainButton, auxButton, getLabel, onMainClick, onAuxClick }">
      <component
        :is="buttonElement"
        v-bind="mainButton"

        @click="onMainClick"
        :label="getLabel(mainButton)"
        :disabled="mainButton?.isDisabled || !props.isFormValid"
        type="button"
      />

      <component
        :is="buttonElement"
        v-bind="auxButton"

        @click="onAuxClick"
        :label="getLabel(auxButton)"
        type="button"
      />
    </slot>
  </footer>
</template>

<script lang="ts" setup>
import type { NormalizedButton, NormalizedSettings, ObjectWithNormalizedButtons } from '@/forms/core'
import { FormModes } from '@/forms/core'
import { buttons } from '@/settings'

const props = defineProps<{
  buttons: ObjectWithNormalizedButtons
  settings: NormalizedSettings
  isFormValid?: boolean
}>()

const emit = defineEmits<{
  (e: 'main-click'): void
  (e: 'aux-click'): void
}>()

const buttonElement = buttons.button
const mainButton = computed(() => props.buttons.main)
const auxButton = computed(() => props.buttons.aux)

const getLabel = computed(() => (button: NormalizedButton) => {
  return props.settings.mode === FormModes.CREATE_MODE ? button.label.create : button.label.update
})

function onMainClick() { emit('main-click') }
function onAuxClick() { emit('aux-click') }
</script>

<style lang="sass">
.form-footer
  @apply py-8
</style>
