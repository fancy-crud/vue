import type { ButtonHTMLAttributes, InputHTMLAttributes, UnwrapRef } from 'vue'
import type { ZodTypeAny } from 'zod'
import type { HandleRequestStatusCodes } from '@/http'

export enum FormModes {
  CREATE_MODE,
  UPDATE_MODE,
}

export interface Button extends ButtonHTMLAttributes {
  label?: { create?: string; update?: string }
  loading?: boolean
  icon?: string
  onClick?: (payload?: MouseEvent) => void
}

export interface Buttons {
  main?: Button
  aux?: Button
}

export interface NormalizedButtons extends Required<Buttons> {}

export interface FieldStructure extends InputHTMLAttributes {
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
  rules?: ZodTypeAny
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

export interface NormalizedFieldStructure extends FieldStructure {
  name: string
  type: string
  class: string
  modelKey: string
  modelValue: unknown
  ref: any
  errors: string[]
  onInput?: (e: Event) => void
}

export interface Actions {
  [k: string]: {
    onInput?: null | ((field: NormalizedFieldStructure) => (e: Event) => void)
    onChange?: null | ((field: NormalizedFieldStructure) => (e: Event) => void)
    onFocus?: null | ((field: NormalizedFieldStructure) => (e: Event) => void)
  }
}

export type Fields<T> = {
  [Key in keyof T]: FieldStructure
}

export type NormalizedFields<T> = {
  [Key in keyof T]: NormalizedFieldStructure
}

export interface Title {
  create?: string
  update?: string
}

export interface Settings {
  url: string
  buttons?: Buttons
  mode?: FormModes
  title?: string | Title
  lookupField?: string
  statusCodesHandlers?: Record<number, HandleRequestStatusCodes>
}

export interface NormalizedSettings extends Settings {
  url: string
  buttons: Required<Buttons>
  mode: FormModes
  title: string | Title
  lookupField: string
  statusCodesHandlers: Record<number, HandleRequestStatusCodes>
}

export interface FieldWatcher {
  value: unknown
  oldValue: unknown
}

export interface IFormRecord extends Record<string, any> {}

export interface Form<T = object> {
  id: string
  fields: NormalizedFields<T> | UnwrapRef<NormalizedFields<T>>
  settings: NormalizedSettings
  generalErrors?: string[]
  record?: IFormRecord
}

export interface CreateForm<T> {
  id: string
  fields: Fields<T>
  settings: Settings
  record?: IFormRecord
}
