import { useHintText, useModelValue } from './utils'
import type { NormalizedPasswordField } from '@/forms/axioma'

export function usePasswordField(props: { field: NormalizedPasswordField }) {
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
