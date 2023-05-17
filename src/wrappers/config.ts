import { OButton } from '@oruga-ui/oruga-next'
import Input from './Input.vue'
import Select from './Select.vue'

export const orugaInputs: Record<string, any> = {
  text: Input,
  select: Select,
}

export const orugaButtons: Record<string, any> = {
  button: OButton,
}
