<script lang="ts">
import { OField, OSelect } from '@oruga-ui/oruga-next'
import type { NormalizedSelectField } from '@fancy-crud/core'
import type { PropType } from 'vue'
import { useSelectField } from '@/forms/integration'

export default defineComponent({
  props: {
    formId: {
      type: Symbol,
      required: true,
    },
    field: {
      type: Object as PropType<NormalizedSelectField>,
      required: true,
    },
  },

  setup(props, { attrs, slots }) {
    const { modelValue, hasFieldErrors, hintText, options } = useSelectField(props)

    const variant = computed(() => hasFieldErrors.value ? 'danger' : '')

    function renderOptions() {
      return options.value.map(
        ([label, value]) => h(
          'option', { modelValue, value }, {
            default: () => String(label),
            ...slots,
          }),
      )
    }

    return () =>
      h(OField, { ...props.field.wrapper, label: props.field.label, message: hintText, variant },
        h(OSelect, { ...attrs, modelValue, expanded: true },
          renderOptions(),
        ),
      )
  },
})
</script>

