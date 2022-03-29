import { h } from "tsx-dom"
import { NormalizedFieldStructure } from "@/core"
import { setModelValue } from "@/core"

export default (args: { formId: string, fieldKey: string, field: NormalizedFieldStructure }) => {
  const { formId, fieldKey, field } = args

  const controlContainerId = `${formId}-field-${fieldKey}-container`
  const controlId = `${formId}-field-${fieldKey}-control`

  const setFieldModelValue = (e: Event) => setModelValue(e, field)

  const attributes = {
    ...field,
    id: controlId,
    onInput: setFieldModelValue,
    type: "date",
    class: "input input-bordered",
  }

  const container = (
    <div id={ controlContainerId } class={`form-control mb-5 px-3 ${ field.cols || 'col-span-12' }`}>
      <label class="label">
        <span class="label-text">{ field.label }</span>
      </label> 
      <input { ...attributes } />
    </div>
  )

  return container
}
