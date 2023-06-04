<script lang="ts">
import _ from 'lodash'
import { OCheckbox, OField } from '@oruga-ui/oruga-next'
import type { NormalizedCheckboxField } from '@fancy-crud/core'
import type { PropType } from 'vue'
import { useCheckboxField } from '@/forms/integration'

export default defineComponent({
  props: {
    formId: {
      type: Symbol,
      required: true,
    },
    field: {
      type: Object as PropType<NormalizedCheckboxField>,
      required: true,
    },
  },

  setup(props, { attrs, slots }) {
    const { modelValue, hasFieldErrors, hintText, inRowDisplay, options } = useCheckboxField(props)

    const nameIdentifier = Symbol(props.field.modelKey).toString()

    const variant = computed(() => hasFieldErrors.value ? 'danger' : '')

    function renderOptions() {
      return options.value.map(
        ([label, value]) => h(
          OCheckbox, { ...attrs, ...getCheckboxAttributes(value), modelValue, name: nameIdentifier }, {
            default: () => String(label),
            ...slots,
          }),
      )
    }

    function getCheckboxAttributes(value: unknown) {
      let attributes: Record<string, unknown> = {}

      if (props.field.multiple) {
        attributes = {
          nativeValue: value,
        }
      }
      else {
        attributes = {
          trueValue: value,
          falseValue: null,
        }
      }

      return attributes
    }

    return () =>
      h(OField, { ...props.field.wrapper, label: props.field.label, message: hintText, variant },
        h('div', { class: inRowDisplay }, renderOptions()),
      )
  },
})
</script>

