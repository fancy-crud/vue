<template>
  <component :is="table.body" v-bind="$attrs" :headers="props.headers" :items="props.items" />
</template>

<script lang="ts" setup>
import type { NormalizedColumn } from '@fancy-crud/core'
import { table } from '@/settings'

const props = defineProps<{
  headers: NormalizedColumn[]
  items: any[]
}>()
</script>
