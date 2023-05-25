import type { TableArgs, UseTable } from '../typing'
import type { BaseFormFieldAsColumn, FieldAsColumn, NormalizedColumn, ObjectWithRawColumns, RawTableFilter, RawTableSetting } from '@/tables/axioma'
import { NormalizeColumns, NormalizePagination } from '@/tables/capabilities'

export function useTable<T extends BaseFormFieldAsColumn, U extends ObjectWithRawColumns, S extends RawTableSetting, F extends RawTableFilter>(
  args: TableArgs<T, U, S, F>,
): UseTable<T, U, S, F> {
  const {
    form,
    columns: rawColumns = {},
    settings: rawSettings = {},
    pagination: rawPagination = {},
    filterParams: rawFilterParams = {},
  } = args

  const mapColumns = new NormalizeColumns()
  const mappedColumns = mapColumns.execute(form.fields, rawColumns)

  const normalizePagination = new NormalizePagination()
  const normalizedPagination = normalizePagination.execute(rawPagination)

  const columns = reactive(mappedColumns) as FieldAsColumn<T['fields'], NormalizedColumn> & U
  const settings = reactive(rawSettings) as S
  const pagination = reactive(normalizedPagination)
  const filterParams = reactive(rawFilterParams) as F

  return {
    columns,
    form,
    settings,
    pagination,
    filterParams,
  }
}
