import { h } from "tsx-dom"
import { html } from "uhtml"
import { Button, defineComponent, FormModes } from ".."

interface FButtonAttributes extends JSX.DOMAttributes, Button {
  disabled?: boolean
  mode?: FormModes
}

export const FButton = (props: FButtonAttributes) => {
  const { disabled, children, label, loading, mode, onClick } = props

  const _label = mode === FormModes.CREATE_MODE ? label?.create : label?.update
  const hasChildren = Array.isArray(children) && children.length
  const loadingClass = loading ? "loading" : ""
  let className = "btn f-btn-main animate-none"
  className = [className, loadingClass].join(" ")

  return defineComponent(
    () => {
      let _children = hasChildren ? children : _label
      _children = !loading ? _children : undefined

      return () => html`${_children}`
    },
    null,
    <button type="button" class={className} />
  )
}
