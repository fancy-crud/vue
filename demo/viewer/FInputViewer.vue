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
    type: FieldType.select,
    label: 'First name',
    wrapper: {
      class: 'col-span-12',
    },
    placeholder: 'Como asi pues?',
    rules: rules.string().min(1),
    class: 'w-full',
  },
  lastName: {
    type: 'text',
    label: 'Last name',
    wrapper: {
      class: 'col-span-12',
    },
    badass: 'badass',
  },
}, {}, {}, settings)
</script>

