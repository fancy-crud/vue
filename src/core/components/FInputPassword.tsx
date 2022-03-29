import { h } from "tsx-dom"
import { FInputAttributes } from "@/core"
import { ControlWrap, ControlLabel, ControlHintMessage } from "./base"

type FInputPasswordAttributes = FInputAttributes & {
  modelValue: string;
}

export function FInputPassword(props: FInputPasswordAttributes) {
  const { fieldKey, field, modelValue, errors, hintText, ...attrs } = props
  const type = field.showPassword ? 'text' : 'password'
  let icon = field.showPassword ? 'mdi-eye' : 'mdi-eye-off'

  const togglePasswordVisibility = (e: Event) => {
    e.preventDefault()
    field.showPassword = !field.showPassword
  }

  const className = `w-full ${field.class}`

  const component = (
    <ControlWrap field={field} fieldKey={fieldKey} clas="">
      <ControlLabel label={ field.label }></ControlLabel>
      <div class="relative">
        <input { ...attrs } type={ type } value={ modelValue } class={ className } />
        <button onClick={ togglePasswordVisibility } class="absolute top-0 right-0 rounded-l-none btn">
          <i class={`mdi ${ icon }`}></i>
        </button>
      </div>
      <ControlHintMessage messages={ [errors.length ? errors : hintText] } error={ errors.length }/>
    </ControlWrap>
  )

  return component
}