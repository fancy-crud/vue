import type { NormalizedSettings, ObjectWithNormalizedButton, ObjectWithNormalizedField } from '@/forms/core'
import { FormModes } from '@/forms/core'
import type { OnFailed, OnFinally, OnSuccess } from '@/http'
import { GenerateFormData } from '@/forms/core/services/fields'

export function useCreateOrUpdateRecord(fields: ObjectWithNormalizedField, buttons: ObjectWithNormalizedButton, settings: NormalizedSettings) {
  const isLoading = ref(false)

  function execute(onSuccess?: OnSuccess, onFailed?: OnFailed, onFinally?: OnFinally) {
    if (typeof buttons.main.onClick === 'function') {
      buttons.main.onClick()
      return
    }

    if (settings.mode === FormModes.CREATE_MODE)
      createRecord(onSuccess, onFailed, onFinally)
    else
      updateRecord(onSuccess, onFailed, onFinally)
  }

  function createRecord(onSuccess?: OnSuccess, onFailed?: OnFailed, onFinally?: OnFinally) {
    isLoading.value = true
    const { jsonForm, formData } = new GenerateFormData().execute(fields)
    const _formData = formData || jsonForm

    useRequestCreate(settings.url, _formData, {
      onSuccess,
      onFailed,
      onFinally() {
        isLoading.value = false
        if (onFinally)
          onFinally()
      },
    })
  }

  function updateRecord(onSuccess?: OnSuccess, onFailed?: OnFailed, onFinally?: OnFinally) {
    const lookupValue = settings.lookupValue || ''

    const { jsonForm, formData } = new GenerateFormData().execute(fields)
    const _formData = formData || jsonForm

    useRequestUpdate(settings.url, lookupValue, _formData, {
      onSuccess,
      onFailed,
      onFinally() {
        isLoading.value = false
        if (onFinally)
          onFinally()
      },
    })
  }

  return {
    execute,
    createRecord,
    updateRecord,
    isLoading,
  }
}
