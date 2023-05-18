import { useHintText, useModelValue } from './utils'
import type { NormalizedTextField } from '@/forms/core'

export function useTextField(props: { field: NormalizedTextField }) {
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
