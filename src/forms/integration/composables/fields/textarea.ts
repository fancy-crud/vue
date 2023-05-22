import { useHintText, useModelValue } from './utils'
import type { NormalizedTextareaField } from '@/forms/axioma'

export function useTextareaField(props: { field: NormalizedTextareaField }) {
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
