interface Props {
  field: {
    hintText?: string
    errors: string[]
  }
}

export function useHintText(props: Props) {
  const { hasFieldErrors } = useRules()
  const hintText = computed(() => {
    let result: string = props.field.hintText ? props.field.hintText : ''

    if (props.field.errors.length)
      result = props.field.errors[0]

    return result
  })

  const hasErrors = computed(() => hasFieldErrors(props.field))

  return {
    hintText,
    hasErrors,
  }
}
