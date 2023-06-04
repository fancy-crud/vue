<template>
  <o-field v-bind="props.field.wrapper" :label="props.field.label" :variant="variant" :message="hintText">
    <div :class="inRowDisplay">
      <template v-for="([label, value], _index) in options" :key="_index">
        <o-radio v-model="modelValue" :name="nameIdentifier" :native-value="value">
          {{ label }}
        </o-radio>
      </template>
    </div>
  </o-field>
</template>

<script lang="ts" setup>
import _ from 'lodash'
import { OField, ORadio } from '@oruga-ui/oruga-next'
import type { NormalizedRadioField } from '@fancy-crud/core'
import { useRadioField } from '@/forms/integration'

const props = defineProps<{
  formId: symbol
  field: NormalizedRadioField
}>()

const nameIdentifier = Symbol(props.field.modelKey).toString()

const { modelValue, hasFieldErrors, hintText, inRowDisplay, options } = useRadioField(props)

const variant = computed(() => hasFieldErrors.value ? 'danger' : '')
</script>

