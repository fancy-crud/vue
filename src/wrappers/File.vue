<template>
  <o-field v-bind="props.field.wrapper" :label="props.field.label" :variant="variant" :message="hintText">
    <o-upload v-bind="props.field" v-model="modelValue">
      <o-button tag="a" variant="primary" label-class="flex items-center">
        <o-icon icon="upload" />
        <span class="pl-4">{{ props.field.label }}</span>
      </o-button>
    </o-upload>
    <span class="file-name pl-4 flex items-center">
      {{ fileNames.join(', ') }}
    </span>
  </o-field>
</template>

<script lang="ts" setup>
import { OButton, OField, OIcon, OUpload } from '@oruga-ui/oruga-next'
import type { NormalizedFileField } from '@fancy-crud/core'
import { useFileField } from '@/forms/integration'

const props = defineProps<{
  field: NormalizedFileField
}>()

const { modelValue, hasErrors, hintText, fileNames } = useFileField(props)

const variant = computed(() => hasErrors.value ? 'danger' : '')
</script>

