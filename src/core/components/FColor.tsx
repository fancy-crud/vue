import { h } from "tsx-dom"
import { FInputAttributes } from "@/core"
import { ControlHintMessage, ControlLabel, ControlWrap } from "."

type FInputColorAttributes = FInputAttributes & { modelValue: string }

export function FColor(props: FInputColorAttributes) {
  const { fieldKey, field, modelValue, errors, hintText, ...attrs } = props
  field.modelValue = field.modelValue ? field.modelValue : '#000000'

  const component = (
    <ControlWrap fieldKey={ fieldKey } field={ field } >
      <ControlLabel label={ field.label }></ControlLabel>
      <div class="relative input input-bordered">
        <span class="absolute font-medium top-1/2 -translate-y-1/2">
          { modelValue }
        </span>
        <input { ...attrs } value={ modelValue } />
      </div>
      <ControlHintMessage messages={ [errors.length ? errors : hintText] } error={ errors.length } />
    </ControlWrap>
  )

  return component
}
