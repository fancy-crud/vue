import { h } from "tsx-dom"
import { ControlHintMessage, ControlLabel, ControlWrap, FInputAttributes } from "./"

function PreviewFile(props: { type: string, url: string }) {
  const { type, url } = props

  const iconClass = type === 'image' ? 'mdi-image' : 'mdi-file'
  const icon = <i class={`mdi  ${iconClass}`}></i>

  const figureImage = (
    <figure tabIndex={ 0 } class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
      <img src={ url } alt="" style="max-width: 500px" />
    </figure>
  )

  return (
    <div class="dropdown dropdown-hover dropdown-left dropdown-end absolute right-0 top-1/2 -translate-y-1/2 z-10">
      <a tabIndex={ 0 } href={ url } target="_blank" class="btn" role="button">
      { icon }
      </a>
      { type === 'image' ? figureImage : undefined }
    </div>
  )
}

export function FInputFile(props: FInputAttributes) {
  const { fieldKey, field, errors, hintText, modelValue, ...attrs } = props

  const getValueString = (): string => {
    let valueString = ''

    if (Array.isArray(field.modelValue)) {
      valueString = field.modelValue.map(f => f.name).join(', ')
    }

    return valueString
  }

  const fileInput = (
    <input { ...attrs } />
  ) as HTMLInputElement

  const input = (
    <p class="absolute left-0 w-full top-1/2 -translate-y-1/2 left-0 pl-3">
      { getValueString() }
    </p>
  )

  const component = (
    <ControlWrap field={ field } fieldKey={ fieldKey }>
      <ControlLabel label={ field.label }></ControlLabel>
      <div class="relative input p-4">
        { fileInput }
        { input }
       <PreviewFile type={ field.type }  url="https://nyota.nl/wp-content/uploads/sites/84/2013/10/500x500.gif" />
      </div>
      <ControlHintMessage messages={ [errors.length ? errors : hintText] } error={ errors.length } />
    </ControlWrap>
  )

  return component
}
