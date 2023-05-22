<template>
  <f-form v-bind="form" disable-notifications />

  <p class="py-8">
    {{ form.fields.gender.modelValue }}
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
import { NotificationType, useForm } from '@/forms/integration'

const { rules } = useRules()

const settings = {
  url: 'artists/',
}

const form = useForm({
  fields: {
    name: {
      type: FieldType.text,
      label: 'First name',
      placeholder: 'Como asi pues?',
      class: 'w-full',
      wrapper: {
        class: 'col-span-12',
      },
    },
    gender: {
      type: FieldType.select,
      label: 'Last name',
      class: 'w-full',
      optionLabel: 'label',
      optionValue: 'value',
      options: [
        { label: 'Male', value: 'm' },
        { label: 'Female', value: 'f' },
      ],
      wrapper: {
        class: 'col-span-12',
      },
    },
  },
  settings,
})
</script>

