import { useHintText, useModelValue } from './utils'
import type { NormalizedDatepickerField } from '@/forms/axioma'

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
