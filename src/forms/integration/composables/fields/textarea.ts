import type { NormalizedTextareaField } from '@fancy-crud/core'
import { FormManagerHandler } from '@fancy-crud/core'
import type { DefaultProps } from '../../typing'
import { useHintText, useModelValue } from './utils'

export function useTextareaField(props: DefaultProps & { field: NormalizedTextareaField }) {
  const formManager = new FormManagerHandler(props.formId)
  const { fields } = formManager.getForm()
  const { modelValue } = useModelValue(props)

  const { validate } = useRules(fields, formManager.ruleOptions)

  const { hintText, hasFieldErrors } = useHintText(props)

  onMounted(() => validate(props.field))

  return {
    validate,
    modelValue,
    hasFieldErrors,
    hintText,
  }
}
