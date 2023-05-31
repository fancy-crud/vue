<template>
  <component :is="utils.table" v-bind="$attrs" :headers="props.headers" :items="props.items" />
</template>

<script lang="ts" setup>
import type { NormalizedColumn } from '@fancy-crud/core'
import { utils } from '@/wrappers/config'

const props = defineProps<{
  headers: NormalizedColumn[]
  items: any[]
}>()
</script>
