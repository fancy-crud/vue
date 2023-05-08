import _ from 'lodash'
import type { Form, FormModes, NormalizedFieldStructure } from '@/forms'

export const setInputTextModelValue = (field: NormalizedFieldStructure, value: any) => {
  field.modelValue = value
}

export const setInputSelectModelValue = (field: NormalizedFieldStructure, value: any) => {
  field.modelValue = field.options?.find(
    (item: any) => item[field.optionValue || ''] === value,
  )
}

export const setInputCheckboxModelValue = (field: NormalizedFieldStructure, value: any) => {
  const singleValue = () => {
    field.modelValue = value
  }

  const multipleValue = () => {
    const indexInModelValue = (field.modelValue as unknown[]).findIndex(
      (item: unknown) => _.isEqual(item, value),
    )

    if (indexInModelValue >= 0) {
      (field.modelValue as unknown[]).splice(indexInModelValue, 1)
      field.modelValue = [...field.modelValue as unknown[]]
    }
    else {
      field.modelValue = [..._.cloneDeep(field.modelValue as unknown[]), value]
    }
  }

  if (Array.isArray(field.options) && Array.isArray(field.modelValue)) {
    multipleValue()
    return
  }

  singleValue()
}

export const setInputFileModelValue = (field: NormalizedFieldStructure, value: any) => {
  const _files = []

  if (!value)
    return

  for (let index = 0; index < value.length; index++)
    _files.push(value[index])

  field.modelValue = _files
}

export const setInputRadioModelValue = (field: NormalizedFieldStructure, value: any) => {
  field.modelValue = value
}

export const togglePasswordVisibility = (field: NormalizedFieldStructure) => {
  field.showPassword = !field.showPassword
}

export const modelValueTypes: Record<string, (field: NormalizedFieldStructure, value: any) => void> = {
  text: setInputTextModelValue,
  textarea: setInputTextModelValue,
  color: setInputTextModelValue,
  date: setInputTextModelValue,
  select: setInputSelectModelValue,
  radio: setInputSelectModelValue,
  checkbox: setInputCheckboxModelValue,
  file: setInputFileModelValue,
  image: setInputFileModelValue,
}

export function setFormMode(form: Form, mode: FormModes) {
  form.settings.mode = mode
}

export function setFormRecord(form: Form, record: unknown) {
  Object.assign(form, { record })
}

export function useFieldModelValue(field: NormalizedFieldStructure, type: string, emit: (name: 'update:modelValue', ...args: any[]) => void) {
  const modelValue = ref<unknown>(field.modelValue)
  const timeout = ref<NodeJS.Timeout | null>(null)

  const modelValueType = modelValueTypes[type]

  watch(() => field.modelValue, () => modelValue.value = field.modelValue)

  watch(() => modelValue.value, () => {
    field.errors = []

    if (field.bounceTime) {
      if (timeout.value) {
        clearTimeout(timeout.value)
        timeout.value = null
      }

      timeout.value = setTimeout(() => {
        modelValueType(field, modelValue.value)
        emit('update:modelValue', modelValue.value)
      }, field.bounceTime)
    }
    else {
      modelValueType(field, modelValue.value)
      emit('update:modelValue', modelValue.value)
    }
  })

  return modelValue
}