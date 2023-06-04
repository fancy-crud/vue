<script lang="ts">
import { OButton, OField, OIcon, OUpload } from '@oruga-ui/oruga-next'
import type { NormalizedFileField } from '@fancy-crud/core'
import type { PropType } from 'vue'
import { useFileField } from '@/forms/integration'

export default defineComponent({
  props: {
    formId: {
      type: Symbol,
      required: true,
    },
    field: {
      type: Object as PropType<NormalizedFileField>,
      required: true,
    },
  },
  setup(props, { attrs, slots }) {
    const { modelValue, hasFieldErrors, hintText, fileNames } = useFileField(props)

    const variant = computed(() => hasFieldErrors.value ? 'danger' : '')

    return () =>
      h(OField, { ...props.field.wrapper, label: props.field.label, variant, message: hintText },
        [
          h(OUpload, { ...attrs, ...props.field, modelValue }, {
            default: () =>
              h(OButton, { tag: 'a', variant: 'primary', labelClass: 'flex items-center' },
                [
                  h(OIcon, { icon: 'upload' }),
                  h('span', { class: 'pl-4' }, props.field.label),
                ],
              ),
            ...slots,
          }),
          h('span', { class: 'file-name pl-4 flex items-center' }, fileNames.value.join(', ')),
        ],
      )
  },
})
</script>

