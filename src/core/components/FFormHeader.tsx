import { h } from "tsx-dom"
import { Form } from ".."

interface FHeaderAttributes {
  form: Form;
  slots?: {
    [k: string]: any
  }
}

export function FFormHeader({ form, slots }: FHeaderAttributes) {
  let title: string | undefined = ''

  if (typeof form.settings.title === 'string') {
    title = form.settings.title
  }
  else {
    title = form.settings.title.create
  }

  const DefaultHeader = () => (
    <header class="p-3">
      <h3 class="text-2xl">{ title }</h3>
    </header>
  )
  const hasHeaderSlot = slots && slots['form-header']
  const Header = hasHeaderSlot ? hasHeaderSlot : DefaultHeader

  return <Header />
}