<template>
  <component :is="table.body" v-bind="$attrs" :headers="props.headers" :items="props.items" />
</template>

<script lang="ts" setup>
import { table } from '@/wrappers/config'
import type { NormalizedColumn } from '@/tables/axioma'

const props = defineProps<{
  headers: NormalizedColumn[]
  items: any[]
}>()

// const emit = defineEmits<{
//   (e: 'edit', row: any): void
//   (e: 'delete', row: any): void
//   (e: 'hot-update', value: { field: string; row: any }): void
// }>()

// const hotUpdate = (field: string, row: any) => {
//   emit('hot-update', { field, row })
// }

// const getValue = computed(() => (row: any, header: NormalizedColumn, rowIndex: number) => {
//   let value: any
//   if (typeof row === 'object')
//     value = row[header.value]

//   if (header.field)
//     value = header.field(row, rowIndex)

//   if (header.format)
//     value = header.format(value)

//   return value
// })
</script>
