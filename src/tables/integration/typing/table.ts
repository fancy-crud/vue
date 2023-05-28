import type { BaseTableForm, FieldAsColumn, MappedRawColumn, NormalizedColumn, NormalizedTablePagination, NormalizedTableSetting, ObjectWithNormalizedColumns, RawTablePagination } from '@/tables/axioma'

export interface UseTable<T extends BaseTableForm, U, S, F> {
  form: T
  columns: FieldAsColumn<T['fields'], NormalizedColumn> & U
  settings: S
  pagination: NormalizedTablePagination
  filterParams: F
}

export interface TableArgs<T extends BaseTableForm, U, S, F> {
  form: T
  columns?: MappedRawColumn<T['fields'], U> & U
  pagination?: RawTablePagination
  settings?: S
  filterParams?: F
}

export interface TableProps {
  columns: ObjectWithNormalizedColumns
  form: BaseTableForm
  settings: NormalizedTableSetting
  pagination: NormalizedTablePagination
  formModal?: boolean
  skipDeleteConfirmation?: boolean
}

export interface Row extends Record<string, unknown> {}