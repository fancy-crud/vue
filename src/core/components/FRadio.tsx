import _ from "lodash"
import { h } from "tsx-dom"
import { FInputAttributes } from ".."
import { ControlWrap, ControlLabel, ControlHintMessage } from "./base"

// type FInputRadioAttributes = FInputAttributes & {
  
// }

type OptionItem = {
  [k: string]: any;
}

export function FRadio(props: FInputAttributes) {
  const { fieldKey, field, children, hintText, errors, modelValue, ...attrs } = props
  const inRow = field.class.includes('in-row') ? 'flex flex-nowrap' : ''

  let radios: HTMLInputElement[] = []

  const setModelValue = (value: OptionItem) => {
    field.modelValue = value
  }

  if (field.options && Array.isArray(field.options)) {
    const optionLabel = field.optionLabel || ''
    const optionValue = field.optionValue || ''

    radios = field.options.map((option: OptionItem, i) => {
      const id = `${field.id}-${i}`
      const isChecked = _.isEqual(option, modelValue)
      return (
        <label class="label cursor-pointer justify-start">
          <input
            { ...attrs }
            id={id}
            value={ option[optionValue] }
            checked={ isChecked }
            onChange={ () => setModelValue(option) }
            onInput={ () => null }
            onBlur={ () => null }
          />
          <span class="pl-4">{ option[optionLabel] }</span>
        </label>
      )
    }) as HTMLInputElement[]
  }

  const component = (
    <ControlWrap field={ field } fieldKey={ fieldKey }>
      <ControlLabel label={ field.label }></ControlLabel>
      <div class={ inRow }>
        { radios }
      </div>
      <ControlHintMessage messages={ [errors.length ? errors : hintText] } error={ errors.length } />
    </ControlWrap>
  )

  return component
}
