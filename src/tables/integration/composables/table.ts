import type { TableArgs, UseTable } from '../typing'
import type { BaseTableForm, FieldAsColumn, NormalizedColumn, ObjectWithRawColumns, RawTableFilter, RawTableSetting } from '@/tables/axioma'
import { NormalizeColumns, NormalizePagination, TableManagerHandler } from '@/tables/capabilities'
import type { NormalizedSettings } from '@fancy-crud/core'
import { FormManagerHandler } from '@fancy-crud/core/manager'

export function useTable<T extends BaseTableForm, U extends ObjectWithRawColumns, S extends RawTableSetting, F extends RawTableFilter>(
  args: TableArgs<T, U, S, F>,
): UseTable<T, U, S, F> {
  const {
    id: _id,
    form,
    columns: rawColumns = {},
    settings: rawSettings = {},
    pagination: rawPagination = {},
    filterParams: rawFilterParams = {},
  } = args

  const id = Symbol(_id)

  const mapColumns = new NormalizeColumns()
  const mappedColumns = mapColumns.execute(form.fields, rawColumns)

  const normalizePagination = new NormalizePagination()
  const normalizedPagination = normalizePagination.execute(rawPagination)

  const columns = reactive(mappedColumns) as FieldAsColumn<T['fields'], NormalizedColumn> & U
  const settings = reactive(rawSettings) as S & NormalizedSettings
  const pagination = reactive(normalizedPagination)
  const filterParams = reactive(rawFilterParams) as F

  const formManager = new FormManagerHandler(form.id)
  const manager = new TableManagerHandler(id)

  manager.addTable({
    columns,
    settings,
    pagination,
    formManager,
  })

  onUnmounted(() => manager.removeTable())

  return {
    id,
    columns,
    form,
    settings,
    pagination,
    filterParams,
    manager,
  }
}
