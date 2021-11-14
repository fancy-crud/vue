<template>
  <div id="app">
    <div class="row justify-center q-mt-lg">
      <div class="col-12">
        <f-filters
          v-model="filters"
        />
      </div>
      <div class="col-6">
        <f-form v-model="form.fields" v-bind="form.settings"></f-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from 'vue';
import { useFilters } from '@/entry.esm'


export default defineComponent({
  name: 'ServeDev',
 
  setup() {
    const form = reactive({
      fields: {
        name: {
          label: 'Nombre',
          rules: ['required']
        },
        // genres: {
        //   label: 'Generos musicales',
        //   rules: ['required'],
        //   url: 'genres/',
        //   optionLabel: 'name',
        //   optionValue: 'id',
        //   inputType: 'select',
        // },
        is_active: { modelValue: true, hidden: true },
      },
      settings: {
        url: 'genres/',
        buttons: {
          aux: { onClick: () => console.log('hello')}
        }
      }
    })


    const { filters, plainFilters } = useFilters({
      country: {
        label: 'country',
        // url: 'countries',
        optionLabel: 'name',
        optionValue: 'id',
        options: [
          { id: 1, name: 'Honduras' },
          { id: 2, name: 'New Zealand' },
        ]
      }
    })


    watch(plainFilters, () => console.log(plainFilters))

    return {
      form,
      filters,
      plainFilters
    }
  }
});
</script>
