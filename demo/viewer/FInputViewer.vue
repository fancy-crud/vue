<template>
  <f-form :form="form" />

  <!-- <div c`lass="p-10 mt-10 border">
    {{ form.fields }}
  </div>` -->

  <!-- <f-button class="">
    Hello
  </f-button> -->
</template>

<script lang='ts' setup>
const { rules } = useRules()

const form = useForm({
  id: 'input-field',
  fields: {
    firstName: {
      label: 'First name',
      modelValue: 'Hello',
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

form.fields.firstName.onDblclick = () => {
  console.log('double click')
}

const { list } = useListRequest('artists/', { search: '' }, {}, {
  autoTrigger: true,
  hotFetch: true,
})
</script>
