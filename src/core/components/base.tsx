import { h } from "tsx-dom"
import { html } from "uhtml"
import { defineComponent } from "@/core"
import { ControlWrapArgs, Control, GeneralMessageErrorProps } from "./types"

export const ControlsContainer = (props: Control) =>
  defineComponent(
    () => {
      return () => props.children
    },
    null,
    <section class="controls grid grid-cols-12"></section>
  )

export const ControlWrap = (args: ControlWrapArgs) => {
  const { fieldKey, field } = args
  const wrapName = `field-${fieldKey}-container`
  const cols = field.wrapCols ? field.wrapCols : "col-span-12"
  let wrapClass = field.wrapClass ? field.wrapClass : "mb-5 px-3"
  wrapClass = `form-control ${wrapClass} ${wrapName} ${cols}`
  return defineComponent(
    () => {
      return () => html`${args.children}`
    },
    null,
    <div class={wrapClass}></div>
  )
}

export const ControlLabel = (props: Control) => {
  return defineComponent(
    () => {
      const { label, children } = props
      const hasChildren = Array.isArray(children) && children.length

      let result: HTMLElement = <span class="label-text f-label-text">{label}</span>

      if (hasChildren) {
        result = <div>{children}</div>
      }

      const component = html`${result}`

      return () => (label ? component : null)
    },
    null,
    <label {...props} class="label f-label"></label>
  )
}

export const ControlHintMessage = (props: Control) =>
  defineComponent(() => {
    const { messages, error } = props
    let className = `label-text-alt label-text font-bold f-label-hint-message pt-3`
    let textColor = "text-gray-400"

    if (error) {
      textColor = "text-red-600"
    }

    className = `${className} ${textColor}`

    const hasMessages =
      Array.isArray(messages) && messages.length && messages.every((i) => !!i)
        ? messages
        : undefined

    const component = html`
      <label ${props} class="label f-label-hint">
        <span class=${className}>${messages}</span>
      </label>
    `

    return () => (hasMessages ? component : null)
  })

export const GeneralMessageError = ({ messageError, icon }: GeneralMessageErrorProps) =>
  defineComponent(() => {
    const defaultMessageError = "Uno o más campos prensentaron errores"
    const _messageError = messageError ? messageError : defaultMessageError

    const _icon = icon ? icon : "mdi mdi-alert"
    const iconTag = <i class={`${_icon} mr-3`}></i>

    const component = html`
      <div class="col-span-12 px-3 pb-5">
        <div class="alert alert-error f-general-error">
          <div>
            ${iconTag}
            <span class="font-bold f-general-error-message">${_messageError}</span>
          </div>
        </div>
      </div>
    `

    return () => component
  })
