import { useHintText, useModelValue } from './utils'
import type { NormalizedColorField } from '@/forms/core'

export function useColorField(props: { field: NormalizedColorField }) {
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
