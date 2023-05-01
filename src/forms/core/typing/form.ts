export interface RawField {
  clearable?: boolean
  label?: string
  multiple?: boolean
  valueString?: string | null
  url?: string
  showPassword?: boolean
  optionLabel?: string
  optionValue?: string
  modelKey?: string
  modelValue?: unknown
  chips?: boolean
  fileUrl?: string
  wrapClass?: string
  class?: string
  wrapCols?: string
  type?: string
  errors?: string[]
  filterParams?: unknown
  options?: any[]
  ref?: unknown
  createOnly?: boolean
  updateOnly?: boolean
  hidden?: boolean
  hintText?: string
  // Define a better type for this property
  rules?: any[]
  bounceTime?: number
  table?: {
    label?: string
    value?: string
    field?: (row: unknown, index: number) => unknown
    format?: (value: unknown) => unknown
    exclude?: boolean
    allowCheckbox?: boolean
    allowImagePreview?: boolean
  }
  xlsx?: Record<string, unknown>
}

export interface NormalizedField extends RawField {
  name: string
  type: string
  class: string
  modelKey: string
  modelValue: unknown
  ref: any
  errors: string[]
  onInput?: (e: Event) => void
}

export type NormalizedFields<T> = { [K in keyof T]: NormalizedField & T[K] }
