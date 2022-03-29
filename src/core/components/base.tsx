import { h } from "tsx-dom"
import { ControlWrapArgs, Control, GeneralMessageErrorProps } from './types'

export function ControlsContainer(props: Control) {
  return (
    <section class="controls grid grid-cols-12">
      { props.children }
    </section>
  )
}

export function ControlWrap(args: ControlWrapArgs) {
  const { fieldKey, field } = args

  const wrapName = `field-${fieldKey}-container`
  const cols = field.wrapCols ? field.wrapCols : 'col-span-12'
  let wrapClass = field.wrapClass ? field.wrapClass : 'mb-5 px-3'
  wrapClass = `form-control ${ wrapClass } ${ wrapName } ${cols}`

  const wrap = (
    <div class={ wrapClass }>
      { args.children }
    </div>
  )

  return wrap
}

export function ControlLabel(props: Control) {
  const { label, children} = props
  const hasChildren = Array.isArray(children) && children.length

  let result: HTMLElement = <span class="label-text f-label-text">{ label }</span>

  if (hasChildren) {
    result = <div>{ children }</div>
  }

  const component = (
    <label { ...props } class="label f-label">
      { result }
    </label> 
  )

  return label ? component : null
}

export function ControlHintMessage(props: Control) {
  const { messages, error } = props
  let className = `label-text-alt label-text font-bold f-label-hint-message pt-3`
  let textColor = 'text-gray-400'

  if (error) {
    textColor = 'text-red-600'
  }
  
  className = `${className} ${textColor}`

  let LabelMessage = ({ children }: any) => (
    <span class={ className }>
      { children }
    </span>
  )

  const hasMessages = (
    Array.isArray(messages) && messages.length && messages.every(i => !!i) ? messages : undefined
  )

  const component = hasMessages ? (
    <label { ...props } class="label f-label-hint">
      <LabelMessage>
        { messages }
      </LabelMessage>
    </label> 
  ) : null

  return component
}

export function GeneralMessageError({ messageError, icon }: GeneralMessageErrorProps) {
  const defaultMessageError = 'Uno o más campos prensentaron errores'
  const _messageError = messageError ? messageError : defaultMessageError

  const _icon = icon ? icon : 'mdi mdi-alert'

  const component = (
    <div class="col-span-12 px-3 pb-5">
      <div class="alert alert-error f-general-error">
        <div>
        <i class={`${ _icon } mr-3`}></i>
          <span class="font-bold f-general-error-message">
            { _messageError }
          </span>
        </div>
      </div>
    </div>
  )
  
  return component
}