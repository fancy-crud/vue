import type { UnwrapRef } from 'vue'
import type { ZodTypeAny } from 'zod'
import type { HandleRequestStatusCodes } from '@/http'

export enum FormModes {
  CREATE_MODE,
  UPDATE_MODE,
}

export interface Settings {
  url: string
  buttons?: Buttons
  mode?: FormModes
  title?: string | Title
  lookupField?: string
  statusCodesHandlers?: Record<number, HandleRequestStatusCodes>
}

export interface NormalizedSettings extends Required<Settings> {
  buttons: NormalizedButtons
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
