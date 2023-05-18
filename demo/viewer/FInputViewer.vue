<template>
  <f-form v-bind="form" />
  <br>
  <br>
  {{ form.fields.lastName.modelValue }}
</template>

<script lang='ts' setup>
import { FieldType } from '@/forms/core'

const { rules } = useRules()

const settings = {
  url: 'artists/',
}

const form = useForm({
  firstName: {
    type: FieldType.password,
    label: 'First name',
    wrapper: {
      class: 'col-span-12',
    },
    placeholder: 'Como asi pues?',
    rules: rules.string().min(1),
    class: 'w-full',
    passwordReveal: true,
  },
  lastName: {
    type: FieldType.file,
    label: 'Last name',
    wrapper: {
      class: 'col-span-12',
    },
    class: 'w-full',
    badass: 'badass',
    multiple: true,
  },
}, {}, {}, settings)
</script>

