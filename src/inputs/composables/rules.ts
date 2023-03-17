import { z as rules } from 'zod'
import type { NormalizedFieldStructure, NormalizedFields } from '@/forms'

function getSchema(fields: [string, NormalizedFieldStructure][], fieldKey: string) {
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

function validate(field: NormalizedFieldStructure) {
  watch(() => field.modelValue, () => {
    if (!field.rules)
      return

    const result = field.rules.safeParse(field.modelValue)

    if (result.success) {
      field.errors = []
      return
    }

    field.errors = result.error.issues.map(issue => issue.message)
  })
}

export function useRules() {
  const isFormValid = computed(() => <T>(fields: NormalizedFields<T>) => {
    const _fields = Object.entries(fields) as [string, NormalizedFieldStructure][]

    const schema = rules.object(getSchema(_fields, 'rules'))
    const result = schema.safeParse(getSchema(_fields, 'modelValue'))

    return result.success
  })

  function hasFieldErrors(field: NormalizedFieldStructure) {
    return !!field.errors.length
  }

  return {
    validate,
    hasFieldErrors,
    rules,
    isFormValid,
  }
}
