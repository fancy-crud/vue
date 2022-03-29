import _ from "lodash"
import { h } from "tsx-dom"
import { FInputAttributes, NormalizedFieldStructure } from ".."
import { ControlWrap, ControlLabel, ControlHintMessage } from "./base"

type OptionItem = {
  [k: string]: any;
}

type FInputMultipleCheckboxAttributes = FInputAttributes & {
  field: NormalizedFieldStructure & {
    modelValue: unknown[] | unknown
  }
}

function SingleCheckbox(props: FInputAttributes) {
  const { field, ...attrs } = props

  return (
    <label class="label cursor-pointer justify-start">
      <input
        { ...attrs }
        checked={ field.modelValue as boolean }
      />
      <span class="pl-4">{ field.label }</span>
    </label>
  )
}

function MultipleCheckbox(props: FInputMultipleCheckboxAttributes) {
  const { field, ...attrs } = props

  if (!Array.isArray(field.modelValue)) return null

  const optionLabel = field.optionLabel || ''
  const optionValue = field.optionValue || ''

  return (field.options as OptionItem[]).map((option, i) => {
    const id = `${field.id}-${i}`
    const isChecked = (field.modelValue as unknown[]).includes(option)

    return (
      <label class="label cursor-pointer justify-start">
        <input
          { ...attrs }
          id={id}
          value={ option[optionValue] }
          checked={ isChecked }
        />
        <span class="pl-4">{ option[optionLabel] }</span>
      </label>
    )
  })
}

export function FCheckbox(props: FInputAttributes) {
  const {
    fieldKey,
    field,
    hintText,
    errors,
    modelValue
  } = props

  let checkbox: HTMLElement | HTMLElement[] | null

  if (Array.isArray(field.options) && Array.isArray(modelValue)) {
    checkbox = MultipleCheckbox(props)
  }
  else {
    checkbox = SingleCheckbox(props)
  }

  const controlLabel = field.options ? <ControlLabel label={ field.label }></ControlLabel> : null

  const component = (
    <ControlWrap field={ field } fieldKey={ fieldKey }>
      { controlLabel }
      { checkbox }
      <ControlHintMessage messages={ [errors.length ? errors : hintText] } error={ errors.length } />
    </ControlWrap>
  )

  return component
}
