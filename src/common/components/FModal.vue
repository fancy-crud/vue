<template>
  <component :is="utils.modal" v-model="modelValue" v-bind="$attrs" />
</template>

<script lang="ts" setup>
import { utils } from '@/wrappers/config'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const modelValue = useVModel(props, 'modelValue', emit)
</script>
