import { columnValue } from '@/tables/capabilities'

export function useColumnValue() {
  const getValue = computed(() => columnValue)

  return {
    getValue,
  }
}
