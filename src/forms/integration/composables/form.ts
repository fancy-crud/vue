import type { NormalizedButtons, NormalizedFields, NormalizedSettings, NormalizedTitles, ObjectWithRawField, RawButton, RawSetting, RawTitle } from '@/forms/core'
import { FillWithRecordValues } from '@/forms/core/services/fields'
import { CreateForm } from '@/forms/foundation'

interface UseForm<T, U> {
  fields: NormalizedFields<T>
  buttons: NormalizedButtons<U>
  titles: NormalizedTitles
  settings: NormalizedSettings
  fillWithRecordValues(record: Record<string, unknown>): void
}

/**
 * A function that provides functionality to create a reactive form object from raw fields, titles, buttons, and settings.
 *
 * @typeparam T - A generic type parameter that extends `ObjectWithRawField`.
 * @typeparam U - A generic type parameter that extends `Record<string, RawButton>`.
 * @param rawFields - A `ObjectWithRawField` object containing the raw fields to be normalized.
 * @param rawTitles - An optional `RawTitle` object containing the raw titles to be normalized.
 * @param rawButtons - An optional `Record<string, RawButton>` object containing the raw buttons to be normalized.
 * @param rawSettings - An optional `RawSettings` object containing the raw settings to be normalized.
 * @returns A `UseForm` object containing the reactive fields, titles, buttons, and settings.
 */
export function useForm<T extends ObjectWithRawField, U extends Record<string, RawButton>>(rawFields: T, rawTitles?: RawTitle, rawButtons?: U, rawSettings?: RawSetting): UseForm<T, U> {
  const { normalizedFields, normalizedTitles, normalizedButtons, normalizedSettings } = new CreateForm().execute(rawFields, rawTitles, rawButtons, rawSettings)

  const fields = reactive(normalizedFields) as NormalizedFields<T>
  const buttons = reactive(normalizedButtons) as NormalizedButtons<U>
  const titles = reactive(normalizedTitles)
  const settings = reactive(normalizedSettings)

  function fillWithRecordValues(record: Record<string, unknown>) {
    const _fillWithRecordValues = new FillWithRecordValues()
    _fillWithRecordValues.execute(fields, record)

    settings.lookupValue = String(record[settings.lookupField] || '')
  }

  return {
    fields,
    titles,
    buttons,
    settings,
    fillWithRecordValues,
  }
}
