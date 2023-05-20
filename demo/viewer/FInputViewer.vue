<template>
  <f-form @error="handleBadRequest" v-bind="form" disable-notifications />

  <p class="py-8">
    {{ form.fields.lastName.modelValue }}
  </p>

  <button @click="form.manager.resetFields" class="px-8 py-4 bg-primary-500 text-white font-bold">
    Reset
  </button>

  <!-- <button @click="form.fillValues" class="px-8 py-4 bg-primary-500 text-white font-bold ml-4">
    Fill
  </button> -->
</template>

<script lang='ts' setup>
import type { AxiosError } from 'axios'
import { FieldType } from '@/forms/core'
import { useForm } from '@/forms/integration'

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
})

function handleBadRequest(_error?: unknown) {
  const error = _error as AxiosError
  console.log(error)
}
</script>

