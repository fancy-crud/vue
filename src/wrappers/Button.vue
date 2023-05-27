<template>
  <o-button v-bind="$attrs" :pack="pack" :icon-right="props.icon" :inverted="props.borderless" />
</template>

<script lang="ts" setup>
import { OButton } from '@oruga-ui/oruga-next'

const props = defineProps<{
  icon: string
  borderless: string
}>()

const attrs = useAttrs()

const pack = computed(() => {
  if (attrs.pack)
    return attrs.pack

  return 'mdi'
})
</script>
