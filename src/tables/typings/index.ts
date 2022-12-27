import type { AxiosResponse } from 'axios'
import type { Form } from '../../forms/typings'

export interface TableHeader {
  label: string
  value: string
  field?: (row: unknown, index: number) => unknown
  format?: (value: unknown) => unknown
  allowCheckbox?: boolean
  allowImagePreview?: boolean
}

export interface Table {
  form: Form
  settings: {
    url: string
    filterParams?: object
    search?: string
    lookupField?: string
    pagination?: {
      page?: number
      rowsPerPage?: number
      count?: number
    }
  }
  onCreate?: (response: AxiosResponse<unknown>) => void
  onUpdate?: (response: AxiosResponse<unknown>) => void
}
