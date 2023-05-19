import type { NormalizedButtons } from './buttons'
import type { NormalizedSettings } from './settings'
import type { NormalizedTitles } from './titles'

export enum FieldType {
  text = 'text',
  password = 'password',
  color = 'color',
  textarea = 'textarea',
  radio = 'radio',
  checkbox = 'checkbox',
  select = 'select',
  file = 'file',
  datepicker = 'datepicker',
}

export interface BaseRawField extends Record<string, any> {
  type: string | FieldType
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
  type: FieldType.text
}

export interface RawPasswordField extends BaseRawField {
  type: FieldType.password
  showPassword?: boolean
}

export interface RawColorField extends BaseRawField {
  type: FieldType.color
}

export interface RawTextareaField extends BaseRawField {
  type: FieldType.textarea
}

export interface RawRadioField extends BaseRawField {
  type: FieldType.radio
  inRow?: boolean
  optionLabel?: string
  optionValue?: string
  options?: any[]
}

export interface RawCheckboxField extends BaseRawField {
  type: FieldType.checkbox
  inRow?: boolean
  optionLabel?: string
  optionValue?: string
  options?: any[]
  multiple?: boolean
}

export interface RawSelectField extends BaseRawField {
  type: FieldType.select
  clearable?: boolean
  multiple?: boolean
  optionLabel?: string
  optionValue?: string
  options?: any[]
  url?: string
  filterParams?: Record<string, unknown>
}

export interface File {
  name: string
}

export interface RawFileField extends BaseRawField {
  type: FieldType.file
  fileUrl?: string
  modelValue: File | File[] | null
}

export interface RawDatepickerField extends BaseRawField {
  type: FieldType.datepicker
}

export type RawField =
  | BaseRawField
  | RawTextField
  | RawPasswordField
  | RawColorField
  | RawTextareaField
  | RawRadioField
  | RawCheckboxField
  | RawSelectField
  | RawFileField
  | RawDatepickerField

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

export type NormalizedFileField = FieldNormalizer<RawFileField>

export type NormalizedDatepickerField = FieldNormalizer<RawDatepickerField>

export type NormalizedFields<T> = { [K in keyof T]: NormalizedField & T[K] }

export interface Form<T, U> {
  originalNormalizedFields: NormalizedFields<T>
  clonedNormalizedFields: NormalizedFields<T>
  normalizedButtons: NormalizedButtons<U>
  normalizedTitles: NormalizedTitles
  normalizedSettings: NormalizedSettings
}

export interface ObjectWithRawFields extends Record<string, RawField> {}
export interface ObjectWithNormalizedFields extends Record<string, NormalizedField> {}

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
