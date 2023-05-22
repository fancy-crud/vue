import type { NormalizedSettings, NormalizedTitles, ObjectWithNormalizedButtons, ObjectWithNormalizedFields } from '@/forms/core'

export interface FormManager {
  originalNormalizedFields: ObjectWithNormalizedFields
  fields: ObjectWithNormalizedFields
  titles: NormalizedTitles
  settings: NormalizedSettings
  buttons: ObjectWithNormalizedButtons
}
