<template>
  <o-modal v-model:active="modelValue" width="640" v-bind="$attrs">
    <template
      v-for="(slotName) in computedSlots"
      #[`${slotName}`]
      :key="slotName"
    >
      <slot :name="slotName" />
    </template>
  </o-modal>
</template>

<script lang="ts" setup>
import { OModal } from '@oruga-ui/oruga-next'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const slots = useSlots()
const modelValue = useVModel(props, 'modelValue', emit)

const computedSlots = computed(() => Object.keys(slots).map((slotName) => {
  return slotName
}))
</script>
