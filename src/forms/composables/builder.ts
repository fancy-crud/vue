import type {
  CreateForm,
  Form,
  IFormRecord,
  NormalizedFieldStructure,
  NormalizedFields,
} from '@/forms'

export function fillFieldsWithRecordValues(form: Form, record: IFormRecord) {
  if (Object.keys(record || {}).length === 0)
    return

  Object.entries(form.fields).forEach(([fieldKey, field]) => {
    if (field.type !== 'file' && field.type !== 'image') {
      field.modelValue = fieldKey
        .split('.')
        .reduce((accumulator, currentValue) => accumulator[currentValue], record)
    }
    else {
      const fileUrl = fieldKey
        .split('.')
        .reduce((accumulator, currentValue) => accumulator[currentValue], record)

      field.fileUrl = String(fileUrl)
    }
  })
}

export function getFormData<T = object>(fields: NormalizedFields<T>) {
  interface Handle { fieldKey: string; field: NormalizedFieldStructure }

  const metadata: { [key: string]: unknown } = {}
  let formData: FormData | null = null

  const handleListValues = ({ fieldKey, field }: Handle) => {
    const formKey = field.modelKey || `${fieldKey}_id`

    const addFormDataValue = (value: any) => {
      const optionValue = String(field.optionValue)

      if (typeof value === 'object') {
        const formValue = value[optionValue]

        if (field.multiple) {
          if (!Array.isArray(metadata[formKey]))
            metadata[formKey] = [formValue]

          else
            (metadata[formKey] as Array<unknown>).push(formValue)
        }
        else {
          metadata[formKey] = formValue
        }
        return
      }

      if (field.multiple) {
        if (!Array.isArray(metadata[formKey]))
          metadata[formKey] = [value]

        else
          (metadata[formKey] as Array<unknown>).push(value)
      }
      else {
        metadata[formKey] = value
      }
    }

    if (!field.modelValue) {
      metadata[formKey] = field.modelValue
      return
    }

    if (field.multiple && Array.isArray(field.modelValue)) {
      field.modelValue.forEach(addFormDataValue)
      return
    }

    addFormDataValue(field.modelValue as any)
  }

  const handleFileValue = ({ fieldKey, field }: Handle) => {
    const formKey = field.modelKey || fieldKey

    if (!formData)
      formData = new FormData()

    if (Array.isArray(field.modelValue)) {
      if (field.multiple)
        field.modelValue.forEach((file: File) => formData?.append(formKey, file))

      else
        formData.set(formKey, field.modelValue[0])

      return
    }
    formData.set(formKey, field.modelValue as any)
  }

  const handleValue = ({ fieldKey, field }: Handle) => {
    const value: unknown = field.modelValue
    metadata[field.modelKey || fieldKey] = value
  }

  const entriesFields: [string, NormalizedFieldStructure][] = Object.entries(fields)

  entriesFields.forEach(([fieldKey, field]) => {
    if (field.url || field.optionValue) {
      handleListValues({ fieldKey, field })
      return
    }

    const isFileOrImage = ['file', 'image'].includes(field.type)

    if (isFileOrImage && field.modelValue)
      handleFileValue({ fieldKey, field })

    else
      handleValue({ fieldKey, field })

    field.errors = []
  })

  return { jsonForm: metadata, formData }
}

export function resetModelValue(form: Form, cloneForm: Form) {
  type FieldKey = keyof typeof form.fields

  Object.entries(cloneForm.fields).forEach(([fieldKey, field]) => {
    Object.assign(form.fields[fieldKey as FieldKey], {
      modelValue: field.modelValue,
      errors: [],
    })
  })
}

export function useForm<T>(args: CreateForm<T>): Form<T> {
  const { fields, settings } = args
  const _fields = normalizeFormFields(fields)

  const _settings = normalizeFormSettings(settings)
  const form: Form<T> = reactive({
    ...args,
    fields: _fields,
    settings: _settings,
  })

  return form
}
