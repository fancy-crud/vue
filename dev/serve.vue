<template>
  <div id="app">
    <div class="row justify-center q-col-gutter-lg">
      <div class="col-10">
        <f-form v-model="form.fields" v-bind="form.settings">
          <template v-slot:form-header="{ title }">
            <h5>{{ title }}</h5>
          </template>
        </f-form>
      </div>
      <div class="col-10 pl-sm">
        <f-table
          v-model="table.form"
          v-bind="table.settings"
          :filterParams="plainFilters"
          hard-delete
        />
      </div>
      <div class="col-10 pl-sm">
        <f-table
          v-model="table2.form"
          v-bind="table2.settings"
          :filterParams="plainFilters"
          hard-delete
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { useFilters } from "@/entry.esm";

export default defineComponent({
  name: "ServeDev",

  setup() {
    const form = reactive({
      fields: {
        name: {
          label: "Nombre",
          rules: ["required"],
          inputType: "date",
        },
        is_active: { modelValue: false, inputType: "checkbox" },
      },
      settings: {
        url: "genres/",
        buttons: {
          aux: { onClick: () => console.log("hello") },
        },
      },
    });

    const table = reactive({
      form: {
        fields: {
          name: {
            label: "Nombre",
            rules: ["required"],
          },
          is_active: {
            label: "Estatus oculto",
            modelValue: true,
            inputType: "checkbox",
            inTable: {
              hidden: true,
            }
          },
        },
        settings: {
          url: "genres/",
        },
      },
      settings: {
        url: "genres/",
      },
    });

    const { filters, plainFilters } = useFilters({
      country: {
        label: "country",
        // url: 'countries',
        optionLabel: "name",
        optionValue: "id",
        options: [
          { id: 1, name: "Honduras" },
          { id: 2, name: "New Zealand" },
        ],
        class: "col-sm-2",
      },
    });

    const table2 = reactive({
      form: {
        fields: {
          name: {
            label: "Nombre del artista",
            rules: ["required"],
          },
          gender: {
            label: "Genero",
            rules: ["required"],
          },
          image: {
            label: "Imagen",
            inputType: 'image'
          },
          image2: {
            label: "Imagen 2",
            inputType: 'image'
          },
          is_active: {
            label: "Estatus",
            modelValue: true,
            inputType: "checkbox",
          },
        },
        settings: {
          url: "artists/",
        },
      },
      settings: {
        url: "artists/",
      },
    });

    return {
      table,
      table2,
      form,
      filters,
      plainFilters,
    };
  },
});
</script>
