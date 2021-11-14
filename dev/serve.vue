<template>
  <div id="app">
    <div class="row justify-center q-mt-lg">
      <div class="col-6">
        <f-form v-model="form.fields" v-bind="form.settings"></f-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';


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

    return {
      form
    }
  }
});
</script>
