import { Actions, NormalizedFieldStructure } from '@/core';
import _ from 'lodash';

const setFocused = (field: NormalizedFieldStructure) => () => {
  field.wasFocused = true
}

export const onFocus = (field: NormalizedFieldStructure) => () => {
  const selector = field.type === 'textarea' ? 'textarea' : 'input'
  const el = (field.ref as HTMLElement).querySelector(selector)

  if (el) {
    const length = el.value.length
    el.setSelectionRange(length, length)
  }

  setFocused(field)()
}

export const setInputTextModelValue = (field: NormalizedFieldStructure) => (e: Event) => {
  let value: any = (e.target as HTMLInputElement).value
  field.modelValue = value
}

export const setInputSelectModelValue = (field: NormalizedFieldStructure) => (e: Event) => {
  let value: any = (e.target as HTMLInputElement).value

  field.modelValue = field.options?.find(
    (item: any) => item[field.optionValue || ''] == value
  )
}

export const setInputCheckboxModelValue = (field: NormalizedFieldStructure) => (e: Event) => {
  const singleValue = () => {
    field.modelValue = (e.target as HTMLInputElement).checked
  }

  const multipleValue = () => {
    const elementValue = (e.target as HTMLInputElement).value
    const value = field.options?.find(
      (item: any) => item[field.optionValue || ''] == elementValue
    )

    const indexInModelValue = (field.modelValue as unknown[]).findIndex(
      (item: any) => _.isEqual(item, value)
    )

    if (indexInModelValue >= 0) {
      (field.modelValue as unknown[]).splice(indexInModelValue, 1)
      field.modelValue = [...(field.modelValue as unknown[])]
    }
    else {
      field.modelValue = [...(field.modelValue as unknown[]), value]
    }
  }

  if (Array.isArray(field.options) && Array.isArray(field.modelValue)) {
    multipleValue()
    return
  }

  singleValue()
}

export const setInputFileModelValue = (field: NormalizedFieldStructure) => (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  const _files = []

  if (!files) return

  for (let index = 0; index < files.length; index++) {
    _files.push(files[index])
  }
  
  field.modelValue = _files
}

export const actions: Actions = {
  'text': { onInput: setInputTextModelValue, onFocus },
  'textarea': { onInput: setInputTextModelValue, onFocus },
  'color': { onChange: setInputTextModelValue, onInput: null, onFocus: setFocused },
  'date': { onInput: setInputTextModelValue, onFocus: setFocused },
  'select': { onInput: setInputSelectModelValue, onFocus: setFocused },
  'radio': { onInput: setInputSelectModelValue, onFocus: setFocused },
  'checkbox': { onInput: setInputCheckboxModelValue, onFocus: setFocused },
  'file': { onChange: setInputFileModelValue, onFocus: setFocused },
  'image': { onChange: setInputFileModelValue, onFocus: setFocused },
}

export const NO_ACTION = () => null
