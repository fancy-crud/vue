import type { Row, TableProps } from '../typing'
import { useFormManager } from '@/forms/integration'

export function useTableCrud(props: TableProps, emit: (e: 'update:formModal', payload: boolean) => void) {
  const formManager = useFormManager(props.form.id)
  const form = formManager.getForm()
  const formModal = ref(Boolean(props.formModal))
  const confirmationModal = ref(false)
  const rowToDelete = ref<Row | null>(null)

  const { list, isFetching, pagination, triggerRequest: fetchItems } = useRequestList(
    props.settings.url,
    props.settings.filterParams,
    props.pagination,
  )

  watch(() => props.formModal, () => {
    formModal.value = Boolean(props.formModal)
  })

  watch(formModal, () => {
    emit('update:formModal', formModal.value)
  })

  function openCreateModal() {
    if (typeof form.buttons.aux.onClick !== 'function')
      Object.assign(form.buttons.aux, { onClick: closeModal })

    formManager.switchToCreateMode()
    formManager.resetFields()
    formModal.value = true
  }

  function openEditModal(row: Row) {
    formManager.resetFields()

    type rowKey = keyof typeof row
    const lookupField = (props.settings.lookupField || form.settings.lookupField) as rowKey
    let lookupValue = ''

    if (Object.prototype.hasOwnProperty.call(row, lookupField))
      lookupValue = String(row[lookupField])

    if (typeof form.buttons.aux.onClick !== 'function')
      Object.assign(form.buttons.aux, { onClick: closeModal })

    useRetrieveRequest(props.settings.url, lookupValue, {
      onSuccess(response: { data: Record<string, unknown> }) {
        formManager.fillWithRecordValues(response.data || {})
        formManager.switchToUpdateMode()

        formModal.value = true
      },
    })
  }

  function deleteRecord(row: Row | null, requestDeleteConfirmation = true) {
    if (!row)
      return

    if (requestDeleteConfirmation && !props.skipDeleteConfirmation) {
      rowToDelete.value = row
      confirmationModal.value = true
      return
    }

    const lookupField = props.settings.lookupField || form.settings.lookupField
    let lookupValue = ''

    if (Object.prototype.hasOwnProperty.call(row, lookupField))
      lookupValue = String(row[lookupField])

    useRequestDelete(props.settings.url, lookupValue)
  }

  function updateCheckbox(value: { field: string; row: Row }) {
    const lookupField = props.settings.lookupField || form.settings.lookupField
    let lookupValue = ''

    if (Object.prototype.hasOwnProperty.call(value.row, lookupField))
      lookupValue = String(value.row[lookupField])

    useRequestUpdate(props.settings.url, lookupValue, {
      [value.field]: !value.row[value.field],
    })
  }

  function closeModal() {
    formModal.value = false
  }

  function openModal() {
    formModal.value = true
  }

  return {
    list,
    isFetching,
    pagination,
    formModal,
    confirmationModal,
    rowToDelete,
    formManager,
    closeModal,
    openModal,
    fetchItems,
    openCreateModal,
    deleteRecord,
    openEditModal,
    updateCheckbox,
  }
}
