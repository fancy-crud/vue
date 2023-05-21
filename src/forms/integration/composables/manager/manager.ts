import { useResponseHandler } from './response-handlers'
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

const forms: Record<symbol, FormManager> = reactive({})

export function useFormManager(id: symbol) {
  const { setResponseHandler, getResponseHandler } = useResponseHandler(id)

  function getForm() {
    return forms[id]
  }

  function addForm(form: FormManager) {
    forms[id] = form

    setResponseHandler({
      400: (errors: any) => setErrors(errors),
    })
  }

  function removeForm() {
    delete forms[id]
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
    getResponseHandler,
  }
}
