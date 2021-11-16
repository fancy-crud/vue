<template>
  <div id="app">
    <div class="row justify-center q-mt-lg">
      <div class="col-12">
        <f-filters v-model="filters" />
      </div>
      <div class="col-6">
        <f-form v-model="form.fields" v-bind="form.settings"></f-form>
      </div>

      <div class="col-10 pl-sm">
        <f-table
          v-model="table.form"
          v-bind="table.settings"
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
        is_active: { modelValue: true, hidden: true },
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
            label: "Estatus",
            modelValue: true,
            hidden: true,
            inputType: "checkbox",
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

    return {
      table,
      form,
      filters,
      plainFilters,
    };
  },
});
</script>
