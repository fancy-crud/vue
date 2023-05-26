<template>
  <component
    :is="buttons.button"
    v-bind="$attrs"
  />
</template>

<script lang="ts" setup>
import { buttons } from '@/settings'
</script>
