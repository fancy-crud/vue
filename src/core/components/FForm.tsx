import { h } from "tsx-dom"
import _ from 'lodash'
import { effect } from '@vue/reactivity'
import { getForeignKeys } from '@/core'
import { FFormAttributes } from '@/core'
import { FFormHeader, FFormMain, FFormFooter } from '.'

export function FForm(props: FFormAttributes) {
  const { form, slots } = props
  let formNode = document.getElementById(form.id) || <form id={ form.id } />
  const formClone = _.cloneDeep(form)

  getForeignKeys(form.fields)

  let formHeader: HTMLElement
  let controlsContainer: HTMLElement
  let formFooter: HTMLElement

  controlsContainer = (
    <FFormMain
      form={ form }
      slots={ slots }
    />
  )

  effect(() => {
    effect(() => {
      const _formHeader = <FFormHeader form={ form } slots={ slots }></FFormHeader>

      if (formHeader) {
        const parent = formHeader.parentNode
        parent?.replaceChild(_formHeader, formHeader)
      }
      formHeader = _formHeader
    })

    effect(() => {
      const _formFooter = (
        <FFormFooter
          form={ form }
          slots={ slots }
          resetFormTo={ formClone }
          onCreate={ props.onCreate }
          onUpdate={ props.onUpdate }
        />
      )

      if (formFooter) {
        const parent = formFooter.parentNode
        parent?.replaceChild(_formFooter, formFooter)
      }
      formFooter = _formFooter
    })

    formNode.replaceChildren(formHeader, controlsContainer, formFooter)
  })

  return formNode
}