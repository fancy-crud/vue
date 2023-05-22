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
import { ORadio } from '@oruga-ui/oruga-next'
import { useRadioField } from '@/forms/integration'
import type { NormalizedRadioField } from '@/forms/axioma'

const props = defineProps<{
  field: NormalizedRadioField
}>()

const nameIdentifier = Symbol(props.field.modelKey).toString()

const { modelValue, hasErrors, hintText, inRowDisplay, options } = useRadioField(props)

const variant = computed(() => hasErrors.value ? 'danger' : '')
</script>

