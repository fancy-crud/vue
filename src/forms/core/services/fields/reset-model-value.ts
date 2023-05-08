import type { NormalizedField, NormalizedFields } from '../../typing'

/**
 * A class that provides functionality to reset the model value of fields in a normalized fields object.
 */
export class ResetModelValue {
  /**
   * Resets the model value of fields in a normalized fields object to their original values.
   *
   * @typeparam T - A generic type parameter that extends `Record<string, NormalizedField>`.
   * @param fields - A `NormalizedFields` object containing the fields whose model values need to be reset.
   * @param originalFields - A `NormalizedFields` object containing the original fields whose model values need to be used for resetting.
   */
  execute<T extends Record<string, NormalizedField>>(fields: NormalizedFields<T>, originalFields: NormalizedFields<T>) {
    type FieldKey = keyof typeof fields

    Object.entries(originalFields).forEach(([fieldKey, field]) => {
      Object.assign(fields[fieldKey as FieldKey], {
        modelValue: field.modelValue,
        errors: [],
      })
    })
  }
}
