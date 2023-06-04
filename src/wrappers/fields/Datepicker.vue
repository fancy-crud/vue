<script lang="ts">
import { ODatepicker, OField } from '@oruga-ui/oruga-next'
import type { NormalizedDatepickerField } from '@fancy-crud/core'
import type { PropType } from 'vue'
import { useDatepickerField } from '@/forms/integration'
export default defineComponent({
  props: {
    formId: {
      type: Symbol,
      required: true,
    },
    field: {
      type: Object as PropType<NormalizedDatepickerField>,
      required: true,
    },
  },
  setup(props, { attrs, slots }) {
    const { modelValue, hasFieldErrors, hintText } = useDatepickerField(props)
    const variant = computed(() => hasFieldErrors.value ? 'danger' : '')

    return () =>
      h(OField, { ...props.field.wrapper, label: props.field.label, message: hintText, variant },
        h(ODatepicker, { ...attrs, ...props.field, modelValue }, slots),
      )
  },
})
</script>

