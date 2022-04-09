import { h } from "tsx-dom"
import { html } from "uhtml"
import { Form, FormModes } from ".."
import { defineComponent, computed } from "@/core"

interface FHeaderAttributes {
  form: Form
  slots?: {
    [k: string]: any
  }
}

export const FFormHeader = ({ form, slots }: FHeaderAttributes) => {
  return defineComponent(
    () => {
      let title = computed(() => {
        if (typeof form.settings.title === "string") {
          return form.settings.title
        }
        return form.settings.mode === FormModes.CREATE_MODE
          ? form.settings.title.create
          : form.settings.title.update
      })

      // const Header = hasHeaderSlot ? hasHeaderSlot : DefaultHeader

      const header = <h3 class="text-2xl">{title.value}</h3>
      const hasHeaderSlot = slots && slots["form-header"]
      const content = hasHeaderSlot ? slots["form-header"] : header

      return () => {
        return html`${content}`
      }
    },
    null,
    <header class="p-3"></header>
  )
}
