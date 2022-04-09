import _ from "lodash"
import { h } from "tsx-dom"
import { html } from "uhtml"
import {
  defineComponent,
  getForeignKeys,
  FFormAttributes,
  FFormHeader,
  FFormMain,
  FFormFooter,
} from "@/core"

export const FForm = (props: FFormAttributes) =>
  defineComponent(() => {
    const { form, slots } = props
    const formClone = _.cloneDeep(form)

    getForeignKeys(form.fields)

    const formHeader = <FFormHeader form={form} slots={slots}></FFormHeader>
    const formMain = <FFormMain form={form} slots={slots} />
    const formFooter = (
      <FFormFooter
        form={form}
        slots={slots}
        resetFormTo={formClone}
        onCreate={props.onCreate}
        onUpdate={props.onUpdate}
      />
    )

    return () => html` <form id=${form.id}>${formHeader} ${formMain} ${formFooter}</form> `
  })
