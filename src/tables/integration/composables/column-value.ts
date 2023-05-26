import type { NormalizedColumn } from '@/tables/axioma'

export function useColumnValue() {
  const getValue = computed(() => (row: any, header: NormalizedColumn, rowIndex: number) => {
    let value: any
    if (typeof row === 'object')
      value = row[header.value]

    if (header.field)
      value = header.field(row, rowIndex)

    if (header.format)
      value = header.format(value)

    return value
  })

  return {
    getValue,
  }
}
