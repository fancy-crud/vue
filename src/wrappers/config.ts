import type { Component } from 'vue'
import Button from './common/Button.vue'
import Text from './fields/Text.vue'
import Color from './fields/Color.vue'
import Password from './fields/Password.vue'
import Select from './fields/Select.vue'
import Radio from './fields/Radio.vue'
import Checkbox from './fields/Checkbox.vue'
import File from './fields/File.vue'
import Datepicker from './fields/Datepicker.vue'
import TableBody from './table/TableBody.vue'
import Modal from './common/Modal.vue'
import { exportComponents } from '@/common/integration'

export const fields = ReturnObject({
  text: Text,
  password: Password,
  color: Color,
  select: Select,
  radio: Radio,
  checkbox: Checkbox,
  file: File,
  datepicker: Datepicker,
})

export const utils = ReturnObject({
  button: Button,
  table: TableBody,
  modal: Modal,
})

function ReturnObject<T extends Record<string, Component>>(obj: T): Record<keyof T, Component> {
  return { ...obj }
}

export default exportComponents()
