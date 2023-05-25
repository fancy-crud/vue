<template>
  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <tr>
      <template
        v-for="header in props.headers"
        :key="`header-${header.value}`"
      >
        <th
          scope="col"
          class="px-6 py-3 text-left"
        >
          {{ header.label }}
        </th>
      </template>
      <th
        scope="col"
        class="px-6 py-3"
      />
    </tr>
    <tr
      v-if="props.isLoading"
      class="relative w-full left-0 top-0 h-1 rounded preloader"
    />
  </thead>
</template>

<script lang="ts" setup>
import type { NormalizedColumn } from '@/tables/axioma'

const props = defineProps<{
  headers: NormalizedColumn[]
  isLoading?: boolean
}>()
</script>
