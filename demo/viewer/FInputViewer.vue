<template>
  <f-form v-bind="form" />

  <p class="py-8">
    {{ form.fields.lastName.modelValue }}
  </p>

  <button @click="manager.resetFields" class="px-8 py-4 bg-primary-500 text-white font-bold">
    Reset
  </button>

  <button @click="fillValues" class="px-8 py-4 bg-primary-500 text-white font-bold ml-4">
    Fill
  </button>
</template>

<script lang='ts' setup>
import { FieldType } from '@/forms/core'
import { useForm, useFormManager } from '@/forms/integration'

const { rules } = useRules()

const settings = {
  url: 'artists/',
}

const form = useForm({
  fields: {
    firstName: {
      type: FieldType.text,
      label: '',
      wrapper: {
        class: 'col-span-12',
      },
      placeholder: 'Como asi pues?',
      rules: rules.string().min(1),
      class: 'w-full',
      passwordReveal: true,
    },
    lastName: {
      type: FieldType.text,
      label: 'Last name',
      wrapper: {
        class: 'col-span-12',
      },
      class: 'w-full',
      badass: 'badass',
    },
  },
  settings,
  buttons: {
    aux: {
      onClick() {
        reset()
      },
    },
  },
})

const manager = useFormManager(form.id)

function fillValues() {
  manager.fillWithRecordValues({
    firstName: 'Christopher',
    lastName: 'Flores',
  })
}

function reset() {
  manager.resetFields()
}
</script>

