import { useResponseHandler } from './response-handlers'
import { NotificationType, useNotification } from './notifications'
import type { FieldErrors, NormalizedSettings, NormalizedTitles, ObjectWithNormalizedButtons, ObjectWithNormalizedFields } from '@/forms/core'
import { FillWithRecordValues, GenerateFormData, ResetFields } from '@/forms/core/services/fields'
import { HandleErrors } from '@/forms/core/services/fields/handle-errors'
import { GetForeignKeyValues } from '@/http/core/services/get-foreign-key-values'
import { RequestService } from '@/http/integration/services'

interface FormManager {
  originalNormalizedFields: ObjectWithNormalizedFields
  fields: ObjectWithNormalizedFields
  titles: NormalizedTitles
  settings: NormalizedSettings
  buttons: ObjectWithNormalizedButtons
}

const forms = new Map<symbol, FormManager>()

export function useFormManager(id: symbol) {
  const { setResponseHandler, getResponseHandler } = useResponseHandler(id)
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
      201: response => pushNotification({ type: NotificationType.success, message: 'Successful', data: response }),
      400: (errors: any) => setErrors(errors),
    })
  }

  function removeForm() {
    forms.delete(id)
    removeNotificationHandlers()
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
    const requestService = new RequestService(httpConfig)
    const getForeignKeyValues = new GetForeignKeyValues(requestService, httpConfig.pagination)

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
  }
}
