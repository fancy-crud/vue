import { h } from "tsx-dom"
import { FInputAttributes } from ".."
import { ControlWrap, ControlLabel, ControlHintMessage } from "./base"

export function FInput(props: FInputAttributes & { modelValue: string }) {
  const { fieldKey, field, children, hintText, errors, modelValue, ...attrs } = props

  const component = (
    <ControlWrap field={ field } fieldKey={ fieldKey }>
      <ControlLabel label={ field.label }></ControlLabel>
      <input { ...attrs } value={ modelValue } />
      <ControlHintMessage messages={ [errors.length ? errors : hintText] } error={ errors.length } />
    </ControlWrap>
  )

  return component
}
