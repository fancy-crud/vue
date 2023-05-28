import { useResponseHandler } from './response-handlers'
import { useNotification } from './notifications'

import type { FormManager } from '@/forms/integration'
import type { FieldErrors, ObjectWithNormalizedFields } from '@/forms/axioma'
import { NotificationType } from '@/forms/integration'
import { FillWithRecordValues, FormModes, GenerateFormData, HandleErrors, ResetFields } from '@/forms/axioma'
import { GetForeignKeyValues } from '@/http/axioma'

const forms = new Map<symbol, FormManager>()

export function useFormManager(id: symbol) {
  const { setResponseHandler, getResponseHandler, removeResponseHandlers } = useResponseHandler(id)
  const { pushNotification, setNotificationHandler, removeNotificationHandlers } = useNotification(id)

  function getForm() {
    const form = forms.get(id)

    if (!form)
      throw new Error(`Unable to found form id(${String(id)})`)

    return form
  }

  function addForm(form: FormManager) {
    forms.set(id, form)

    // TODO: Create default handlers
    setResponseHandler({
      400: (errors: any) => setErrors(errors),
    })
  }

  function removeForm() {
    forms.delete(id)
    removeNotificationHandlers()
    removeResponseHandlers()
  }

  function fillWithRecordValues(record: Record<string, unknown>) {
    const form = getForm()
    const fillWithRecordValues = new FillWithRecordValues()
    fillWithRecordValues.execute(form.fields, record)

    form.settings.lookupValue = String(record[form.settings.lookupField] || '')
  }

  function resetFields() {
    const form = getForm()
    const reset = new ResetFields()

    reset.execute(form.fields, form.originalNormalizedFields)
  }

  function getForeignKeyValues(fields?: ObjectWithNormalizedFields) {
    const form = fields ? { fields } : getForm()
    const getForeignKeyValues = new GetForeignKeyValues(httpService)

    getForeignKeyValues.execute({ ...form.fields })
  }

  function getFormData(fields?: ObjectWithNormalizedFields) {
    const form = fields ? { fields } : getForm()

    const formData = new GenerateFormData()
    return formData.execute(form.fields)
  }

  function setErrors(errors: FieldErrors) {
    const form = getForm()

    const handleErrors = new HandleErrors()
    handleErrors.execute(form.fields, errors)

    if (!form.settings.disableNotifications)
      pushNotification({ type: NotificationType.error, data: errors })
  }

  function switchToCreateMode() {
    const form = getForm()

    form.settings.mode = FormModes.CREATE_MODE
  }

  function switchToUpdateMode() {
    const form = getForm()

    form.settings.mode = FormModes.UPDATE_MODE
  }

  return {
    fillWithRecordValues,
    getForeignKeyValues,
    resetFields,
    removeForm,
    addForm,
    getFormData,
    getForm,
    setErrors,
    setResponseHandler,
    setNotificationHandler,
    getResponseHandler,
    pushNotification,
    switchToCreateMode,
    switchToUpdateMode,
  }
}
