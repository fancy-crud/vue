import type { Form, IFormRecord, NormalizedFields } from '../typings'

export interface FormData {
  jsonForm: {
    [key: string]: unknown
  }
  formData: null
}

export interface FormRepository {
  fillFieldsWithRecordValues(form: Form, record: IFormRecord): void
  getFormData<T = object>(fields: NormalizedFields<T>): FormData
  resetModelValue(form: Form, cloneForm: Form): void
}
