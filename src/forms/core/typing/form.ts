import type { NormalizedButtons } from './buttons'
import type { NormalizedSettings } from './settings'
import type { NormalizedTitles } from './titles'

export interface BaseRawField extends Record<string, any> {
  type: string
  wrapper?: Record<string, unknown>
  class?: string
  label?: string
  errors?: string[]
  createOnly?: boolean
  updateOnly?: boolean
  hidden?: boolean
  hintText?: string
  rules?: any
  bounceTime?: number
  modelKey?: string
  modelValue?: unknown
}

export interface RawTextField extends BaseRawField {
  type: 'text'
}

export interface RawPasswordField extends BaseRawField {
  showPassword?: boolean
  type: 'password'
}

export interface RawColorField extends BaseRawField {
  type: 'color'
}

export interface RawTextareaField extends BaseRawField {
  type: 'textarea'
}

export interface RawRadioField extends BaseRawField {
  type: 'radio'
}

export interface RawCheckboxField extends BaseRawField {
  type: 'checkbox'
}

export interface RawSelectField extends BaseRawField {
  type: 'select'
  clearable?: boolean
  multiple?: boolean
  optionLabel?: string
  optionValue?: string
  options?: any[]
  url?: string
  filterParams?: Record<string, unknown>
}

export interface RawFileField extends BaseRawField {
  type: 'file'
  fileUrl?: string
}

// export interface RawField extends Record<string, any> {
// chips?: boolean
// valueString?: string | null
// Define a better type for this property
// table?: {
//   label?: string
//   value?: string
//   field?: (row: unknown, index: number) => unknown
//   format?: (value: unknown) => unknown
//   exclude?: boolean
//   allowCheckbox?: boolean
//   allowImagePreview?: boolean
// }
// xlsx?: Record<string, unknown>
// }

export type RawField =
  | RawTextField
  | RawPasswordField
  | RawColorField
  | RawTextareaField
  | RawRadioField
  | RawCheckboxField
  | RawSelectField

export interface DefaultAttributes {
  name: string
  class: string
  modelKey: string
  modelValue: unknown
  ref: any
  errors: string[]
}

export type FieldNormalizer<T> = T & DefaultAttributes

export type NormalizedField = FieldNormalizer<RawField>

export type NormalizedTextField = FieldNormalizer<RawTextField>

export type NormalizedColorField = FieldNormalizer<RawColorField>

export type NormalizedPasswordField = FieldNormalizer<RawPasswordField>

export type NormalizedTextareaField = FieldNormalizer<RawTextareaField>

export type NormalizedRadioField = FieldNormalizer<RawRadioField>

export type NormalizedCheckboxField = FieldNormalizer<RawCheckboxField>

export type NormalizedSelectField = FieldNormalizer<RawSelectField>

export type NormalizedFields<T> = { [K in keyof T]: NormalizedField & T[K] }

export interface Form<T, U> {
  originalNormalizedFields: NormalizedFields<T>
  clonedNormalizedFields: NormalizedFields<T>
  normalizedButtons: NormalizedButtons<U>
  normalizedTitles: NormalizedTitles
  normalizedSettings: NormalizedSettings
}

export interface ObjectWithRawField extends Record<string, RawField> {}
export interface ObjectWithNormalizedField extends Record<string, NormalizedField> {}
