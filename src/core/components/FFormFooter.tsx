import { h } from "tsx-dom"
import _ from "lodash"
import { resetModelValue } from "@/core"
import { FButton, FFormFooterAttributes } from "."
import { handleErrorRequest, triggerCreateOrUpdate } from "../http"
import { AxiosError } from "axios"
import { successNotification } from "../notifications"
import { FormModes } from "../form"

export function FFormFooter({
  form,
  resetFormTo,
  slots,
  onCreate,
  onUpdate,
}: FFormFooterAttributes) {
  const cloneForm = _.cloneDeep(resetFormTo)
  const mainButton = form.settings.buttons.main

  if (!form.settings.buttons.aux.onClick) {
    form.settings.buttons.aux.onClick = () => resetModelValue(form, cloneForm)
  }
  const auxButton = form.settings.buttons.aux

  const onClick = async () => {
    let result: {
      isActionSucceed: boolean
      value: any
    }

    try {
      result = await triggerCreateOrUpdate(form)
    } catch (err) {
      const error = err as { value: AxiosError }
      handleErrorRequest(form, error.value.response)
      form.generalError = "Uno o más campos presentaron errores"
      return
    }

    const onCreateOrUpdate = {
      [FormModes.CREATE_MODE]: onCreate,
      [FormModes.UPDATE_MODE]: onUpdate,
    }[form.settings.mode]

    if (typeof onCreateOrUpdate === "function") onCreateOrUpdate(result.value)

    successNotification()
    resetModelValue(form, cloneForm)
  }

  if (!mainButton.onClick) {
    mainButton.onClick = onClick
  }

  const MainButton = FButton({
    label: mainButton.label,
    disabled: !form.settings.isValid,
    mode: form.settings.mode,
    ...mainButton,
  })

  const AuxButton = () => (
    <FButton label={auxButton.label} mode={form.settings.mode} {...auxButton} />
  )

  const DefaultFooter = () => (
    <footer class="px-3">
      ${MainButton}
      <AuxButton />
    </footer>
  )

  const hasFooterSlot = slots && slots["form-footer"]
  const Footer = hasFooterSlot ? slots["form-footer"] : DefaultFooter

  return <Footer />
}
