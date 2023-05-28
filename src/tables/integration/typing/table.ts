import type { useFormManager } from '@/forms/integration'
import type { DeleteRequestOptions } from '@/http'
import type { BaseTableForm, FieldAsColumn, MappedRawColumn, NormalizedColumn, NormalizedTablePagination, NormalizedTableSetting, ObjectWithNormalizedColumns, RawTablePagination } from '@/tables/axioma'

export interface TableArgs<T extends BaseTableForm, U, S, F> {
  id?: string
  form: T
  columns?: MappedRawColumn<T['fields'], U> & U
  pagination?: RawTablePagination
  settings?: S
  filterParams?: F
}

export interface TableManager {
  columns: ObjectWithNormalizedColumns
  formManager: ReturnType<typeof useFormManager>
  settings: NormalizedTableSetting
  pagination: NormalizedTablePagination
}

export interface Row extends Record<string, unknown> {}

export interface UseTable<T extends BaseTableForm, U, S, F> {
  id: symbol
  form: T
  columns: FieldAsColumn<T['fields'], NormalizedColumn> & U
  settings: S
  pagination: NormalizedTablePagination
  filterParams: F
}

export interface SetupOptions {
  onReady?: () => void
  onClickAux?: () => void
}

export interface DeleteRecordOptions extends DeleteRequestOptions {
  onRequestDeleteConfirmation?: (row: Row) => void
}
