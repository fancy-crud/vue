<template>
  <component :is="utils.table" v-bind="$attrs" :headers="props.headers" :items="props.items" />
</template>

<script lang="ts" setup>
import { utils } from '@/wrappers/config'
import type { NormalizedColumn } from '@/tables/axioma'

const props = defineProps<{
  headers: NormalizedColumn[]
  items: any[]
}>()
</script>
