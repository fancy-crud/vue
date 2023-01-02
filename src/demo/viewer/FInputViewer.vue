<template>
  <f-form :form="form" />

  <div class="p-10 mt-10 border">
    {{ list }}
  </div>
</template>

<script lang='ts' setup>
const { rules } = useRules()

const form = useForm({
  id: 'input-field',
  fields: {
    input: {
      label: 'Text',
      modelValue: 'Como',
      bounceTime: 3000,
      rules: rules.string().min(1),
    },
  },
  settings: {
    url: 'artists/',
  },
})

const { list, filterParams } = useListRequest('artists/', { search: '' }, {}, {
  autoTrigger: true,
  hotFetch: true,
})

watch(() => form.fields.input.modelValue as string, (value) => {
  filterParams.search = value
})
</script>

