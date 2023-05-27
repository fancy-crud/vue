<script lang="ts">
import { utils } from '@/wrappers/config'

export default defineComponent({
  setup(_, { attrs, slots }) {
    return () => h(utils.modal, attrs, slots)
  },
})
</script>
