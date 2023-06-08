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
    const { vmodel, hasFieldErrors, hintText, options } = useSelectField(props)

    const variant = computed(() => hasFieldErrors.value ? 'danger' : '')

    function renderOptions() {
      return options.value.map(
        ([label, value]) => h(
          'option', { value }, {
            default: () => String(label),
            ...slots,
          }),
      )
    }

    return () =>
      h(OField, { ...props.field.wrapper, label: props.field.label, message: hintText.value, variant: variant.value }, {
        default: () => h(OSelect, { ...attrs, ...props.field, ...vmodel, expanded: true }, {
          default: () => renderOptions(),
        }),
      })
  },
})
</script>

