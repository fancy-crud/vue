export interface TableHeader {
  label: string
  value: string
  field?: (row: unknown, index: number) => unknown
  format?: (value: unknown) => unknown
  allowCheckbox?: boolean
  allowImagePreview?: boolean
}

export interface Table {
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
  onCreate?: (response: unknown) => void
  onUpdate?: (response: unknown) => void
}
