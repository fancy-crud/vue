import { h } from "tsx-dom"

export function FModal(props?: any) {
  const component = (
    <div>
      { props.activator }
      <div id="my-modal" class="modal">
        { props.children }
      </div>
    </div>
  )

  return component
}