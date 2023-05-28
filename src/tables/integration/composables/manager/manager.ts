import type { DeleteRecordOptions, Row, SetupOptions, TableManager } from '../../typing'

const tables = new Map<symbol, TableManager>()

export function useTableManager(id: symbol) {
  function getTable() {
    const table = tables.get(id)

    if (!table)
      throw new Error(`Unable to found table id(${String(id)})`)

    return table
  }

  function addTable(table: TableManager) {
    tables.set(id, table)
  }

  function removeTable() {
    tables.delete(id)
  }

  function setupFormToCreateRecord(options?: SetupOptions) {
    const { formManager } = getTable()
    const form = formManager.getForm()

    if (typeof form.buttons.aux.onClick !== 'function' && options?.onClickAux)
      Object.assign(form.buttons.aux, { onClick: options.onClickAux })

    formManager.switchToCreateMode()
    formManager.resetFields()

    if (options?.onReady)
      options.onReady()
  }

  function setupFormToEditRecord(row: Row, options?: SetupOptions) {
    const { formManager, settings } = getTable()
    const form = formManager.getForm()
    formManager.resetFields()

    type rowKey = keyof typeof row
    const lookupField = (settings.lookupField || form.settings.lookupField) as rowKey
    let lookupValue = ''

    if (Object.prototype.hasOwnProperty.call(row, lookupField))
      lookupValue = String(row[lookupField])

    if (typeof form.buttons.aux.onClick !== 'function' && options?.onClickAux)
      Object.assign(form.buttons.aux, { onClick: options.onClickAux })

    useRetrieveRequest(settings.url, lookupValue, {
      onSuccess(response: { data: Record<string, unknown> }) {
        formManager.fillWithRecordValues(response.data || {})
        formManager.switchToUpdateMode()

        if (options?.onReady)
          options.onReady()
      },
    })
  }

  function deleteRecord(row: Row | null, options?: DeleteRecordOptions) {
    if (!row)
      return

    const { formManager, settings } = getTable()
    const form = formManager.getForm()

    if (options?.onRequestDeleteConfirmation && !settings.skipDeleteConfirmation) {
      options.onRequestDeleteConfirmation(row)
      return
    }

    const lookupField = settings.lookupField || form.settings.lookupField
    let lookupValue = ''

    if (Object.prototype.hasOwnProperty.call(row, lookupField))
      lookupValue = String(row[lookupField])

    useRequestDelete(settings.url, lookupValue, options)
  }

  function updateCheckbox(value: { field: string; row: Row }) {
    const { formManager, settings } = getTable()
    const form = formManager.getForm()

    const lookupField = settings.lookupField || form.settings.lookupField
    let lookupValue = ''

    if (Object.prototype.hasOwnProperty.call(value.row, lookupField))
      lookupValue = String(value.row[lookupField])

    useRequestUpdate(settings.url, lookupValue, {
      [value.field]: !value.row[value.field],
    })
  }

  return {
    getTable,
    addTable,
    removeTable,
    setupFormToCreateRecord,
    setupFormToEditRecord,
    deleteRecord,
    updateCheckbox,
  }
}
