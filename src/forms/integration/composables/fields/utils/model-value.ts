interface Props {
  field: {
    modelValue: unknown
  }
}

export function useModelValue(props: Props) {
  const modelValue = useVModel(props.field, 'modelValue', undefined, { passive: true })

  watch(modelValue, (value) => {
    Object.assign(props.field, { modelValue: value })
  }, { deep: true })

  watch(() => props.field.modelValue, (value) => {
    if (value !== modelValue.value)
      modelValue.value = value
  })

  return {
    modelValue,
  }
}
