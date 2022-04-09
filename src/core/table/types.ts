import { AxiosResponse } from "axios"
import { Form } from ".."

export interface TableHeader {
  label: string
  value: string
  field?: (row: unknown, index: number) => unknown
  format?: (value: unknown) => unknown
}

export interface TableAttributes {
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
