import type { NormalizedDatepickerField } from '@fancy-crud/core'
import { useHintText, useModelValue } from './utils'

export function useDatepickerField(props: { field: NormalizedDatepickerField }) {
  const { modelValue } = useModelValue(props)

  const { validate } = useRules()

  const { hintText, hasErrors } = useHintText(props)

  onMounted(() => validate(props.field))

  return {
    validate,
    modelValue,
    hasErrors,
    hintText,
  }
}
