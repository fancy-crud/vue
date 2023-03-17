<template>
  <div @mouseenter="show" @mouseleave="hide" ref="triggerEl">
    <slot />
  </div>
  <div ref="targetEl" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip">
    {{ props.text }}
    <div class="tooltip-arrow" data-popper-arrow />
  </div>
</template>

<script lang="ts" setup>
import type { TooltipInterface, TooltipOptions } from 'flowbite'
import type { Placement } from '@popperjs/core'
import { Tooltip } from 'flowbite'

const props = defineProps<{
  text: string
  delay?: number | string
  placement?: Placement
}>()

const targetEl = ref<HTMLElement>()
const triggerEl = ref<HTMLElement>()
const tooltip = ref<TooltipInterface | null>(null)
const timeout = ref<NodeJS.Timeout | null>(null)

onMounted(() => initTooltip())

function initTooltip() {
  const options: TooltipOptions = {
    placement: props.placement || 'top',
    triggerType: 'click',
  }
  tooltip.value = new Tooltip(targetEl.value, triggerEl.value, options)
}

function show() {
  if (timeout.value)
    clearTimeout(timeout.value)

  timeout.value = setTimeout(() => tooltip.value?.show(), Number(props.delay || 0))
}

function hide() {
  if (timeout.value)
    clearTimeout(timeout.value)

  tooltip.value?.hide()
}
</script>

