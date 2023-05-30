import { useHintText, useModelValue, useOptions } from './utils'
import type { NormalizedCheckboxField } from '@fancy-crud/core'

export function useCheckboxField(props: { field: NormalizedCheckboxField }) {
  const { modelValue } = useModelValue(props)

  const { validate } = useRules()

  const { options } = useOptions(props)
  const { hintText, hasErrors } = useHintText(props)

  const inRowDisplay = computed(() => {
    return props.field.inRow ? 'checkbox-group--in-row' : ''
  })

  normalizeModelValue()
  onMounted(() => validate(props.field))

  function setModelValue(value: any) {
    modelValue.value = value
  }

  function normalizeModelValue() {
    const isArray = Array.isArray(modelValue.value)

    if (props.field.multiple && !isArray) {
      modelValue.value = []
      return
    }

    if (!props.field.multiple && isArray)
      modelValue.value = null
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
