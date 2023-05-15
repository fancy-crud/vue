import type { NormalizedTextField } from '@/forms/core'

export function useInput(props: { field: NormalizedTextField }) {
  const modelValue = useVModel(props.field, 'modelValue', undefined, { passive: true })

  const { validate, hasFieldErrors } = useRules()

  const hasErrors = computed(() => hasFieldErrors(props.field))

  const hintTextOrErrors = computed(() => {
    let result: string = props.field.hintText ? props.field.hintText : ''

    if (props.field.errors.length)
      result = props.field.errors[0]

    return result
  })

  onMounted(() => validate(props.field))

  watch(modelValue, (value) => {
    Object.assign(props.field, { modelValue: value })
  }, { deep: true })

  watch(() => props.field.modelValue, (value) => {
    if (value !== modelValue.value)
      modelValue.value = value
  })

  return {
    validate,
    modelValue,
    hasErrors,
    hintTextOrErrors,
  }
}
