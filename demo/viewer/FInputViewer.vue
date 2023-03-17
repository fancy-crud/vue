<template>
  <f-input :field="form.fields.firstName" />

  <!-- <f-form :form="form" /> -->

  {{ form.fields.firstName.modelValue }}
</template>

<script lang='ts' setup>
const { rules } = useRules()

const form = useForm({
  id: 'input-field',
  fields: {
    firstName: {
      label: 'First name',
      modelValue: 'Hello',
      class: 'col-span-12',
      rules: rules.string().min(1),
    },
    lastName: {
      label: 'Last Name',
    },
  },
  settings: {
    url: 'artists/',
  },
})
</script>

