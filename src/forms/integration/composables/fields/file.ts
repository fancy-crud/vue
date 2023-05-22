import { useHintText, useModelValue } from './utils'
import type { NormalizedFileField } from '@/forms/axioma'

export function useFileField(props: { field: NormalizedFileField }) {
  const { modelValue } = useModelValue(props)

  const { validate } = useRules()

  const { hintText, hasErrors } = useHintText(props)

  const fileNames = computed(() => {
    if (Array.isArray(modelValue.value))
      return modelValue.value.map(file => file.name)

    if (modelValue.value)
      return [modelValue.value.name]

    return []
  })

  onMounted(() => validate(props.field))

  return {
    validate,
    modelValue,
    hasErrors,
    hintText,
    fileNames,
  }
}
