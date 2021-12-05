import { watch, reactive } from 'vue'

import { IFormField, IFormProps, IFormButtons, IFormRecord } from "@/interfaces/Form";
import { getForeignKeys } from './http';
import { useRules } from "@/composables";
import { INotifications } from '@/interfaces/Notification';


const rules = useRules()

const CREATE_MODE = 'CREATE_MODE'
const UPDATE_MODE = 'UPDATE_MODE'

export { CREATE_MODE, UPDATE_MODE }

export function getButtons(buttons: IFormButtons): IFormButtons {
  const { main, aux } = buttons

  return {
    ...buttons,
    main: {
      createLabel: 'Crear nuevo',
      updateLabel: 'Actualizar registro',
      color: 'primary',
      ...main
    },
    aux: {
      label: 'Cancelar',
      color: 'blue-grey-7',
      outline: true,
      ...aux,
    },
  }
}

export function getNotificationMessages(messages: {[key: string]: any}): INotifications {
  return {
    create: {
      position: 'top-right',
      message: 'Elemento creado con éxito',
      color: 'positive',
      display: true,
      ...messages.create
    },
    update: {
      position: 'top-right',
      message: 'Elemento actualizado con éxito',
      color: 'positive',
      display: true,
      ...messages.update
    },
    delete: {
      position: 'top-right',
      message: 'Elemento eliminado con éxito',
      color: 'positive',
      display: true,
      ...messages.delete
    },
    error: {
      position: 'top-right',
      message: 'Error inesperado, contacte con soporte técnico',
      color: 'negative',
      display: true,
      ...messages.error
    }
  }
}

export function validateForm<T>(fields: T) {
  let isFormValid = false
  const fieldsWithValues = Object.values(fields).filter((field) => {
    if (!('hidden' in field) && ('rules' in field) && field.rules) {
      return !field.hidden && field.rules && field.rules.length
    }
  })

  if (!fieldsWithValues.length) {
    isFormValid = true
  }

  // Check if all fields were focused at least once time
  // and doesn't has initial value, else form keep invalid
  if (fieldsWithValues.some(field => !field.wasFocused && !field.modelValue)) {
    isFormValid = false
  } else {
    let isValid = true
    for (const field of fieldsWithValues) {
      if (field.ref && field.wasFocused) {
        if (field.rules.length) {
          const valid = field.rules.every((rule: Function) => rule(field.modelValue) === true)

          if (!valid) {
            isValid = valid
            break
          }
        }
      }
    }

    isFormValid = isValid
  }

  return isFormValid
}

export function createDefaultKeys<T>(fields: T, fieldsNames: string[]) {
  
  const checkIncludes = [
    { key: 'modelValue', defaultValue: <T>(field: IFormField<T>) => field.multiple ? [] : null },
    { key: 'wasFocused', defaultValue: false },
    { key: 'errors', defaultValue: [] },
    { key: 'rules', defaultValue: [] },
  ]

  for (let index = 0; index < fieldsNames.length; index++) {
    const field = (fields[fieldsNames[index]] as Object)
    const fieldKeys: string[] = Object.keys(field || {})

    checkIncludes.forEach(row => {
      if (!fieldKeys.includes(row.key)) {
        if (typeof row.defaultValue === 'function') {
          field[row.key] = row.defaultValue(field as any)
        }
        else {
          field[row.key] = row.defaultValue
        }
      }
    })

    if (field['inputType'] === 'autocomplete') {
      field['valueString'] = ''
    }
    
    if (field['inputType'] === 'password' && !fieldKeys.includes('showPassword')) {
      field['showPassword'] = false
    }
    
    if (fieldKeys.includes('url') && !fieldKeys.includes('items')) {
      field['items'] = []
    }
  }
}

export function fillFieldsWithRecordValues<T extends Object>(fields: T, record: IFormRecord) {
  if (Object.keys(record || {}).length === 0) return

  Object.keys(fields).forEach((fieldKey: string) => {
    const field = fields[fieldKey]

    if (field['url']) {
      if (field['multiple']) {
      field['modelValue'] = record[fieldKey]
      } else {
        if (record[fieldKey] !== null) {
          if (record[fieldKey] !== undefined) {
            field['modelValue'] = record[fieldKey][field['optionValue']]
          }
        } else {
          field['modelValue'] = record[fieldKey]
        }
      }
    } else {
      if (field['inputType'] !== 'file' && field['inputType'] !== 'image') {
        field['modelValue'] = fieldKey.split('.').reduce(
          (accumulator, currentValue) => accumulator[currentValue], record
        )
      }
    }
  })
}

export function parseRules<T>(fields: IFormField<T>) {
  Object.values(fields).forEach(field => {
    field['rules'].forEach((rule: string | ((value: any) => boolean | string), index: number) => {
      if (typeof rule === 'string') {
        field['rules'][index] = rules[`${rule}Rule`]()
      }
    })
  })
}

export function useForm<T extends Object>(props: IFormProps<T>) {

  const form = reactive({
    fields: props.fields,
    isValid: true,
    buttons: getButtons(props.buttons),
    messages: getNotificationMessages(props.messages)
  })
  
  const fieldsNames = Object.keys(form.fields)

  const getFormData = (): FormData => {
    const formData = new FormData()
    
    fieldsNames.forEach((fieldKey: string) => {
      const field = form.fields[fieldKey]
  
      if (field['url']) {
        if (field['multiple']) {
          field['modelValue'].forEach((value: {[key: string]: any}) => formData.append(`${field['key'] || fieldKey}`, value[field['optionValue']]))
        } else {
          if (field['modelValue'] || field['modelValue'] === 0) {
            const value = typeof field['modelValue'] === 'object' ? field['modelValue'][field['optionValue']] : field['modelValue']
            formData.set(fieldKey.includes('_id') ? fieldKey : `${field['key'] || fieldKey}_id`, value)
          }
        }
      } else {
        if ((field['inputType'] === 'file' || field['inputType'] === 'image') && field['modelValue']) {
          if (field['multiple'] && Array.isArray(field['modelValue'])) {
            field['modelValue'].forEach((file: File) => formData.append(field['key'] || fieldKey, file))
          } else {
            if (Array.isArray(field['modelValue'])) {
              formData.set(field['key'] || fieldKey, field['modelValue'][0])
            } else {
              formData.set(field['key'] || fieldKey, field['modelValue'])
            }
          }
        } else {
          if (field['modelValue'] || field['modelValue'] === 0 || field['inputType'] === 'checkbox') {
            const value = typeof field['modelValue'] === 'object' ? field['modelValue'][field['optionValue']] : field['modelValue']
            formData.set(field['key'] || fieldKey, value)
          }
        }
      }
  
      field['errors'] = []
    })
  
    return formData
  }

  const fieldAttrs = <T>(field: IFormField<T>) => {
    const styles = {
      filled: field.readonly,
      readonly: field.readonly,
      outlined: !field.readonly,
    }
  
    const events = {
      onFocus: () => (field as Object)['wasFocused'] = true,
      'onUpdate:modelValue': (value: any) => field.modelValue = value
    }
  
    return {
      ...styles,
      ...events,
      ...field
    }
  }

  createDefaultKeys(form.fields, fieldsNames)
  parseRules(form.fields)
  fillFieldsWithRecordValues(form.fields, props.record)
  getForeignKeys(form.fields)

  watch(() => props.mode, (mode) => {
    if (mode === UPDATE_MODE) {
      fillFieldsWithRecordValues(form, props.record)
    }
  })

  // Object.values(form.fields).forEach(field => {
  //   watch(() => field, (currentField, previousField) => {
  //     if (!currentField['wasFocused'] || previousField['wasFocused']) {
  //       form.isValid = validateForm(form.fields)
  //     }
  //   })
  // })

  return {
    form,
    getFormData,
    fieldAttrs
  }
}