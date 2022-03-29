import { h } from "tsx-dom"
import { FInputAttributes } from "@/core"
import { ControlHintMessage, ControlLabel, ControlWrap } from "."

export function FTextarea(args: FInputAttributes) {
  const { fieldKey, errors, hintText, field, modelValue, ...attrs } = args

  const component = (
    <ControlWrap fieldKey={ fieldKey } field={ field }>
      <ControlLabel label={ field.label }></ControlLabel>
      <textarea { ...attrs }>{ modelValue as string }</textarea>
      <ControlHintMessage messages={ [errors.length ? errors : hintText] } error={ errors.length } />
    </ControlWrap>
  )

  return component
}