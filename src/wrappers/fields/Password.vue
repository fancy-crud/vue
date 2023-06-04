<script lang="ts">
import { OField, OInput } from '@oruga-ui/oruga-next'
import type { NormalizedPasswordField } from '@fancy-crud/core'
import type { PropType } from 'vue'
import { usePasswordField } from '@/forms/integration'
export default defineComponent({
  props: {
    formId: {
      type: Symbol,
      required: true,
    },
    field: {
      type: Object as PropType<NormalizedPasswordField>,
      required: true,
    },
  },
  setup(props, { attrs, slots }) {
    const { modelValue, hasFieldErrors, hintText } = usePasswordField(props)
    const variant = computed(() => hasFieldErrors.value ? 'danger' : '')

    return () =>
      h(OField, { ...props.field.wrapper, label: props.field.label, message: hintText, variant },
        h(OInput, { ...attrs, ...props.field, modelValue }, slots),
      )
  },
})
</script>

