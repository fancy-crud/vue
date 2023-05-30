import { useHintText, useModelValue, useOptions } from './utils'
import type { NormalizedRadioField } from '@fancy-crud/core'

export function useRadioField(props: { field: NormalizedRadioField }) {
  const { modelValue } = useModelValue(props)

  const { validate } = useRules()

  const { options } = useOptions(props)
  const { hintText, hasErrors } = useHintText(props)

  const inRowDisplay = computed(() => {
    return props.field.inRow ? 'radio-group--in-row' : ''
  })

  onMounted(() => validate(props.field))

  function setModelValue(value: any) {
    modelValue.value = value
  }

  return {
    setModelValue,
    modelValue,
    inRowDisplay,
    options,
    hintText,
    hasErrors,
  }
}
