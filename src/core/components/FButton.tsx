import { h } from "tsx-dom"
import { Button, FormModes } from ".."

interface FButtonAttributes extends JSX.DOMAttributes, Button {
  disabled?: boolean;
  mode?: FormModes;
}

export function FButton(props: FButtonAttributes) {
  const {
    disabled,
    children,
    label,
    loading,
    mode,
    ...attributes
  } = props

  const _label = mode === FormModes.CREATE_MODE ? label?.create : label?.update
  const hasChildren = Array.isArray(children) && children.length
  const loadingClass = loading ? 'loading' : ''

  let className = `btn f-btn-main animate-none`
  className = `${className} ${ loadingClass }`

  let _children = hasChildren ? children : _label
  _children = !loading ? _children : undefined

  const button = (
    <button
      disabled={ disabled }
      class={ className }
      type="button"
      { ...attributes }
    >
      { _children }
    </button>
  )

  return button
}