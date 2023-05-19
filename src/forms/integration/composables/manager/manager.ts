import type { NormalizedField, NormalizedSettings, NormalizedTitles } from '@/forms/core'
import { FillWithRecordValues, ResetFields } from '@/forms/core/services/fields'

interface FormManager {
  originalNormalizedFields: Record<string, NormalizedField>
  fields: Record<string, NormalizedField>
  titles: NormalizedTitles
  settings: NormalizedSettings
}

const forms: Record<symbol, FormManager> = reactive({})

export function useFormManager(id: symbol) {
  function getForm() {
    return forms[id]
  }
  function addForm(form: FormManager) {
    forms[id] = form
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

    Object.entries(form.originalNormalizedFields).forEach(([fieldKey, field]) => {
      reset.execute(form.fields[fieldKey], field)
    })
  }

  return {
    fillWithRecordValues,
    resetFields,
    addForm,
  }
}
