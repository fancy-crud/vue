import type { Component } from 'vue'

export const utils: Record<'button' | 'modal', Component> = {
  button: {},
  modal: {},
}

export function setUtils(newUtils: unknown) {
  Object.assign(utils, newUtils)
}
