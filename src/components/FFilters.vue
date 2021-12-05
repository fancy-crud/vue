<template>
  <section v-for="(filter, filterKey) in filters" :key="filterKey" class="row mb-3">
    <q-select v-bind="filter" :class="`filter-${filterKey}`" outlined />
  </section>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";

import { QSelect } from "quasar";

export default defineComponent({
  name: "FancyFilters",

  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },

  setup(props, { emit }) {
    const filters = props.modelValue;

    watch(props.modelValue, () => {
      Object.keys(filters).forEach((filterKey: string) => {
        const filter = filters[filterKey];

        watch(() => filter.value, () => emit("update:modelValue", filters));
      });
    });

    return { filters };
  },

  components: {
    QSelect,
  },
});
</script>
