<template>
  <f-form :form="form" />

  <input v-model="form.fields.input.modelValue" type="text">

  <div class="p-10 mt-10 border">
    {{ form.fields.input.modelValue }}
  </div>
</template>

<script lang='ts' setup>
const form = useForm({
  id: 'input-field',
  fields: {
    input: {
      label: 'Text',
      modelValue: 'Como',
      bounceTime: 3000,
    },
  },
  settings: {
    url: 'artists/',
  },
})
</script>
