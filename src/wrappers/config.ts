import Button from './Button.vue'
import Text from './Text.vue'
import Color from './Color.vue'
import Password from './Password.vue'
import Select from './Select.vue'
import Radio from './Radio.vue'
import Checkbox from './Checkbox.vue'
import File from './File.vue'
import Datepicker from './Datepicker.vue'
import TableBody from './TableBody.vue'
import Modal from './Modal.vue'

export const fields: Record<string, any> = {
  text: Text,
  password: Password,
  color: Color,
  select: Select,
  radio: Radio,
  checkbox: Checkbox,
  file: File,
  datepicker: Datepicker,
}

export const utils: Record<string, any> = {
  button: Button,
  table: TableBody,
  modal: Modal,
}
