import { h } from "tsx-dom"
import { ControlHintMessage, ControlLabel, ControlWrap } from './base'

export function FSelect(props: any) {
  const {
    fieldKey,
    field,
    rules,
    errors,
    hintText,
    placeholder,
    options,
    emitters,
    optionLabel,
    optionValue,
    modelValue,
    ...attrs
  } = props

  const attributes = { ...attrs }
  let label: HTMLElement | undefined = <ControlLabel label={ field.label }></ControlLabel>
  // const hintText

  const placeholderOption = <option disabled selected>{ placeholder  as string }</option>
  const input = (
    <ControlWrap field={ field } fieldKey={ fieldKey }>
      { label }
      <select { ...attributes }>
        { placeholderOption }
      </select>
      <ControlHintMessage messages={ [errors.length ? errors : hintText] } error={ errors.length }/>
    </ControlWrap>
  )

  if (field.url) {
    const select = input.querySelector('select')

    if (select) {
      const _options = field.options.map((value: any) => {
        const _optionValue = value[String(optionValue)]
        const _optionLabel = value[String(optionLabel)]
        const currentValue = modelValue ? modelValue[optionValue] : null

        const optionAttributes =  _optionValue == currentValue ? { selected: true } : {}
  
        return (
          <option value={ _optionValue } { ...optionAttributes }>{ _optionLabel }</option>
        )
      })

      select.replaceChildren(placeholderOption, ..._options)
    }
  }

  return input
}