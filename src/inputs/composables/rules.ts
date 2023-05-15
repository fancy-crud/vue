import { z as rules } from 'zod'
import type { NormalizedField, NormalizedFields } from '@/forms/core'

function getSchema(fields: [string, NormalizedField][], fieldKey: string) {
  return fields.reduce((accumulator, previous) => {
    const [fieldName, field] = previous

    type FieldKey = keyof typeof field
    if (!field[fieldKey as FieldKey])
      return accumulator

    return {
      ...accumulator,
      [fieldName]: field[fieldKey as FieldKey],
    }
  }, {})
}

function validate(field: NormalizedField) {
  watchDebounced(
    () => field.modelValue,
    () => {
      if (!field.rules)
        return

      const result = field.rules.safeParse(field.modelValue)

      if (result.success) {
        field.errors = []
        return
      }

      field.errors = result.error.issues.map((issue: { message: any }) => issue.message)
    },
    { debounce: 300, maxWait: 1000 },
  )
}

export function useRules<T>(fields?: NormalizedFields<T>) {
  const isFormValid = computed(() => {
    if (!fields)
      throw new Error('You should provide Normalized fields to use isFormValid')

    const _fields = Object.entries(fields) as [string, NormalizedField][]

    const schema = rules.object(getSchema(_fields, 'rules'))
    const result = schema.safeParse(getSchema(_fields, 'modelValue'))

    return result.success
  })

  function hasFieldErrors(field: NormalizedField) {
    return !!field.errors.length
  }

  return {
    validate,
    hasFieldErrors,
    rules,
    isFormValid,
  }
}
